App({
  onLaunch() {
    const userInfo = wx.getStorageSync('milkTeaGashapon_userInfo');
    if (userInfo) {
      console.log('Existing session found for:', userInfo.nickName);
    }

    // Enable share menu globally
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  globalData: {
    currentBrand: null
  }
});