const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    showLoginPrompt: false,
    milkTea: null,
    brand: null,
    description: '经典口味，浓郁奶香',
    capsuleClass: '',
    pearlClass: '',
    nameClass: '',
    cardClass: '',
    pearlGraphicClass: '',
    showPearl: false
  },

  onLoad(options) {
    // Set result data from URL params
    this.setData({
      milkTea: options.milkTea ? decodeURIComponent(options.milkTea) : '默认奶茶',
      brand: options.brandName ? decodeURIComponent(options.brandName) : '未知品牌',
      description: options.description ? decodeURIComponent(options.description) : '经典口味，浓郁奶香'
    });

    // Check auth
    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, showLoginPrompt: false });
    } else {
      this.setData({ showLoginPrompt: true });
    }

    // Trigger result animation sequence
    this.triggerResultAnimation();
  },

  triggerResultAnimation() {
    // Step 1: Capsule pops in
    setTimeout(() => {
      this.setData({ capsuleClass: 'capsule-popin' });
    }, 200);

    // Step 2: Capsule opens after 0.8s
    setTimeout(() => {
      this.setData({ capsuleClass: 'capsule-open-result', showPearl: true });
      // Pearl bounces in
      this.setData({ pearlClass: 'pearl-bounce' });
      // Name fades in
      this.setData({ nameClass: 'result-name-fadein' });
    }, 1000);

    // Step 3: Result card reveals
    setTimeout(() => {
      this.setData({ cardClass: 'card-reveal' });
    }, 1600);

    // Step 4: Pearl graphic below card appears
    setTimeout(() => {
      this.setData({ pearlGraphicClass: 'pearl-bounce' });
    }, 2000);
  },

  onLoginTap() {
    auth.requestAuth(
      (userInfo) => {
        this.setData({ userInfo, showLoginPrompt: false });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      () => {
        wx.showToast({ title: '登录已取消', icon: 'none' });
      }
    );
  },

  onRetryTap() {
    wx.navigateBack({ delta: 1 });
  },

  onShareTap() {
    // Implemented in Phase 4
    wx.showToast({ title: '分享功能开发中', icon: 'none' });
  }
});
