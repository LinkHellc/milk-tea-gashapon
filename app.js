App({
  onLaunch() {
    const userInfo = wx.getStorageSync('milkTeaGashapon_userInfo');
    if (userInfo) {
      console.log('Existing session found for:', userInfo.nickName);
    }
  },
  globalData: {
    currentBrand: null
  }
});