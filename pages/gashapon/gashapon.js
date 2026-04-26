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
    // Implemented in Wave 2 — placeholder for now
    console.log('onGashaponTap called');
  }
});