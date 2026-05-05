const { brands } = require('../../data/brands.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    brands: brands,
    currentBrand: null,
    showDropdown: false,
    userInfo: null,
    isAuthorized: false,
    isSpinning: false,
    capsuleClass: '',
    showPearl: false,
    showResult: false,
    resultMilkTea: null,
    showCustomPanel: false,
    customName: '',
    customDesc: '',
    customMilkTeas: []
  },

  onLoad(options) {
    // Load brands data
    this.setData({ brands: brands });

    // Initialize current brand from URL param or default to first
    if (options.brandId) {
      const brand = brands.find(b => b.id === options.brandId);
      if (brand) {
        this.setData({ currentBrand: brand });
        wx.setNavigationBarTitle({ title: brand.name });
      }
    } else {
      this.setData({ currentBrand: brands[0] });
      wx.setNavigationBarTitle({ title: brands[0].name });
    }

    // Check existing session (Phase 1 auth pattern)
    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, isAuthorized: true });
    }

    // Load custom milk teas for current brand
    this.loadCustomMilkTeas();
  },

  toggleCustomPanel() {
    if (this.data.isSpinning) return;
    if (!this.data.showCustomPanel) {
      // Load custom milk teas when opening
      this.loadCustomMilkTeas();
    }
    this.setData({ showCustomPanel: !this.data.showCustomPanel });
  },

  loadCustomMilkTeas() {
    wx.cloud.callFunction({
      name: 'getCustomMilkTeas',
      data: { brandId: this.data.currentBrand.id },
      success: (res) => {
        if (res.result && res.result.success) {
          this.setData({ customMilkTeas: res.result.data.customMilkTeas });
        }
      }
    });
  },

  onCustomNameInput(e) {
    this.setData({ customName: e.detail.value });
  },

  onCustomDescInput(e) {
    this.setData({ customDesc: e.detail.value });
  },

  submitCustomMilkTea() {
    const { customName, currentBrand } = this.data;
    if (!customName || !customName.trim()) {
      wx.showToast({ title: '请输入奶茶名称', icon: 'none' });
      return;
    }

    wx.cloud.callFunction({
      name: 'addCustomMilkTea',
      data: {
        brandId: currentBrand.id,
        name: customName.trim(),
        description: this.data.customDesc.trim()
      },
      success: (res) => {
        if (res.result && res.result.success) {
          wx.showToast({ title: '添加成功', icon: 'success' });
          this.setData({ customName: '', customDesc: '' });
          this.loadCustomMilkTeas();
        } else {
          wx.showToast({ title: res.result.error || '添加失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '添加失败', icon: 'none' });
      }
    });
  },

  toggleDropdown() {
    if (this.data.isSpinning) return;  // Disable during animation
    this.setData({ showDropdown: !this.data.showDropdown });
  },

  onBrandChange(e) {
    if (this.data.isSpinning) return;  // Disable during animation
    const index = e.currentTarget.dataset.brandIndex;
    const brand = this.data.brands[index];
    this.setData({
      currentBrand: brand,
      showDropdown: false
    });
    wx.setNavigationBarTitle({ title: brand.name });
  },

  onGashaponTap() {
    if (this.data.isSpinning) return;

    // Auth check first
    if (!this.data.isAuthorized) {
      auth.requestAuth(
        (userInfo) => {
          this.setData({ userInfo, isAuthorized: true });
          this.startAnimation();
        },
        () => {
          // Allow even if auth cancelled
          this.startAnimation();
        }
      );
    } else {
      this.startAnimation();
    }
  },

  startAnimation() {
    this.setData({ isSpinning: true, capsuleClass: '', showPearl: false, showResult: false, resultMilkTea: null });

    // Start animation sequence
    // Step 1: Capsule rises through straw (after cup tilt)
    setTimeout(() => {
      this.setData({ capsuleClass: 'capsule-rise' });
    }, 200);

    // Step 2: Capsule ejects above cup
    setTimeout(() => {
      this.setData({ capsuleClass: 'capsule-eject' });
    }, 1200);

    // Step 3: Capsule opens, pearl and result visible
    setTimeout(() => {
      this.setData({ capsuleClass: 'capsule-open', showPearl: true, showResult: true });
    }, 1800);

    // Call cloud function to get result
    wx.cloud.callFunction({
      name: 'gashapon',
      data: {
        brandId: this.data.currentBrand.id
      },
      success: (res) => {
        if (res.result && res.result.success) {
          this.setData({ resultMilkTea: res.result.data.milkTea });

          // Record draw and get points/achievements
          wx.cloud.callFunction({
            name: 'recordDraw',
            data: {
              brandId: this.data.currentBrand.id,
              milkTeaName: res.result.data.milkTea.name,
              isHidden: false
            },
            success: (recordRes) => {
              if (recordRes.result && recordRes.result.success) {
                const { pointsEarned, unlockedAchievements } = recordRes.result.data;

                // Show achievement unlock toast if any
                if (unlockedAchievements && unlockedAchievements.length > 0) {
                  unlockedAchievements.forEach((ach, index) => {
                    setTimeout(() => {
                      wx.showToast({
                        title: `🎉 解锁成就：${ach.name}`,
                        icon: 'none',
                        duration: 2000
                      });
                    }, index * 500);
                  });
                }

                // Store points for display
                this.setData({
                  pointsEarned: pointsEarned,
                  totalPoints: recordRes.result.data.totalPoints
                });
              }
            }
          });
        } else {
          // Fallback to first milk tea of brand if error
          const defaultMilkTeas = {
            'yidiandian': { name: '波霸奶茶', description: '大颗珍珠，嚼劲十足' },
            'xichaha': { name: '多肉葡萄', description: '葡萄果肉饱满，清爽解腻' },
            'bawangchaji': { name: '伯牙绝弦', description: '茉莉雪芽，茶香浓郁' },
            'guming': { name: '桂花系列', description: '桂花乌龙，唇齿留香' },
            'chabaidao': { name: '茉莉奶绿', description: '茉莉花香，清新回甘' },
            'coco': { name: '奶茶三兄弟', description: '珍珠+布丁+椰果，超满足' },
            'koi': { name: '伯爵奶茶', description: '伯爵红茶，经典风味' },
            'ruixing': { name: '生椰拿铁', description: '生椰+咖啡，潮流之选' },
            'hushangayi': { name: '手打柠檬茶', description: '柠檬清香，真实果肉' }
          };
          this.setData({ resultMilkTea: defaultMilkTeas[this.data.currentBrand.id] || { name: '精选奶茶', description: '门店推荐' } });
        }
      },
      fail: (err) => {
        console.error('Cloud function call failed:', err);
        // Use fallback
        const defaultMilkTeas = {
          'yidiandian': { name: '波霸奶茶', description: '大颗珍珠，嚼劲十足' },
          'xichaha': { name: '多肉葡萄', description: '葡萄果肉饱满，清爽解腻' },
          'bawangchaji': { name: '伯牙绝弦', description: '茉莉雪芽，茶香浓郁' },
          'guming': { name: '桂花系列', description: '桂花乌龙，唇齿留香' },
          'chabaidao': { name: '茉莉奶绿', description: '茉莉花香，清新回甘' },
          'coco': { name: '奶茶三兄弟', description: '珍珠+布丁+椰果，超满足' },
          'koi': { name: '伯爵奶茶', description: '伯爵红茶，经典风味' },
          'ruixing': { name: '生椰拿铁', description: '生椰+咖啡，潮流之选' },
          'hushangayi': { name: '手打柠檬茶', description: '柠檬清香，真实果肉' }
        };
        this.setData({ resultMilkTea: defaultMilkTeas[this.data.currentBrand.id] || { name: '精选奶茶', description: '门店推荐' } });
      },
      complete: () => {
        // Navigate to result after animation completes
        setTimeout(() => {
          this.navigateToResult();
        }, 2500);
      }
    });
  },

  navigateToResult() {
    const milkTea = this.data.resultMilkTea || { name: '精选奶茶', description: '门店推荐' };
    wx.navigateTo({
      url: `/pages/result/result?brandId=${this.data.currentBrand.id}&brandName=${encodeURIComponent(this.data.currentBrand.name)}&milkTea=${encodeURIComponent(milkTea.name)}&description=${encodeURIComponent(milkTea.description || '')}`
    });
    // Reset spin state
    this.setData({ isSpinning: false, capsuleClass: '', showPearl: false, showResult: false });
  }
});
