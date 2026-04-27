const { brands } = require('../../data/brands.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    brands: brands,
    currentBrand: null,
    showDropdown: false,
    userInfo: null,
    isAuthorized: false,
    isSpinning: false
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
  },

  toggleDropdown() {
    this.setData({ showDropdown: !this.data.showDropdown });
  },

  onBrandChange(e) {
    // Handle dropdown item tap via data-brand-index
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
    if (!this.data.isAuthorized) {
      auth.requestAuth(
        (userInfo) => {
          this.setData({ userInfo, isAuthorized: true });
          this.startGashapon();
        },
        () => {
          // D-02: still allow even if auth cancelled
          this.startGashapon();
        }
      );
    } else {
      this.startGashapon();
    }
  },

  startGashapon() {
    this.setData({ isSpinning: true });
    wx.navigateTo({
      url: `/pages/result/result?brandId=${this.data.currentBrand.id}&brandName=${encodeURIComponent(this.data.currentBrand.name)}&milkTea=默认奶茶`
    });
  }
});
