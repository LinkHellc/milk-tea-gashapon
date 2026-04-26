const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    drawCount: 0,
    points: 0,
    achievementCount: 0
  },

  onLoad() {
    // Auth guard — check on load
    const userInfo = auth.getStoredUserInfo();
    if (!userInfo) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      // Don't navigate back — show the not-logged state instead
      return;
    }
    this.setData({ userInfo });
    // Load user stats (from cloud in Phase 5, defaults for now)
    this.setData({
      drawCount: 0,
      points: 0,
      achievementCount: 0
    });
  },

  onShow() {
    // Re-check auth state when page shows (user may have logged in elsewhere)
    const userInfo = auth.getStoredUserInfo();
    this.setData({ userInfo: userInfo || null });
  },

  onLoginTap() {
    auth.requestAuth(
      (userInfo) => {
        this.setData({ userInfo });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      () => {
        wx.showToast({ title: '登录已取消', icon: 'none' });
      }
    );
  },

  onHistoryTap() {
    wx.showToast({ title: '历史记录开发中', icon: 'none' });
  },

  onAchievementTap() {
    wx.showToast({ title: '成就系统开发中', icon: 'none' });
  },

  onLogoutTap() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.clearUserInfo();
          this.setData({ userInfo: null });
          wx.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  }
});