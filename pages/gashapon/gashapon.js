const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    isAuthorized: false,
    currentBrand: null,
    isSpinning: false
  },

  onLoad(options) {
    if (options.brandId) {
      this.setData({ currentBrand: options.brandId });
    }
    // Check existing session
    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, isAuthorized: true });
    }
  },

  onGashaponTap() {
    if (this.data.isSpinning) return;
    if (!this.data.isAuthorized) {
      auth.requestAuth(
        (userInfo) => { this.setData({ userInfo, isAuthorized: true }); this.startGashapon(); },
        () => { this.startGashapon(); }  // D-02: still allow even if cancel
      );
    } else {
      this.startGashapon();
    }
  },

  startGashapon() {
    this.setData({ isSpinning: true });
    wx.navigateTo({ url: `/pages/result/result?brand=${encodeURIComponent(this.data.currentBrand || '未知品牌')}&milkTea=默认奶茶` });
  }
});