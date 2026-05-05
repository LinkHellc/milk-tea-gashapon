const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    totalPoints: 0,
    totalDraws: 0,
    achievements: [],
    unlockedCount: 0
  },

  onLoad() {
    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo });
    }
    this.loadUserData();
  },

  onShow() {
    this.loadUserData();
  },

  loadUserData() {
    wx.cloud.callFunction({
      name: 'getUserData',
      success: (res) => {
        if (res.result && res.result.success) {
          const { points, totalDraws, achievements } = res.result.data;
          const unlockedCount = achievements.filter(a => a.unlocked).length;
          this.setData({
            totalPoints: points,
            totalDraws,
            achievements,
            unlockedCount
          });
        }
      },
      fail: (err) => {
        console.error('getUserData failed:', err);
      }
    });
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  goDraw() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    return {
      title: '今天喝什么 - 个人中心',
      path: '/pages/profile/profile'
    };
  }
});
