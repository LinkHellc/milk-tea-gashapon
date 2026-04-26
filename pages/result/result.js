const auth = require('../../utils/auth.js');

Page({
  data: {
    userInfo: null,
    showLoginPrompt: false,
    milkTea: null,
    brand: null,
    description: '经典口味，浓郁奶香'
  },

  onLoad(options) {
    this.setData({
      milkTea: options.milkTea || '默认奶茶',
      brand: options.brand || '未知品牌'
    });

    const userInfo = auth.getStoredUserInfo();
    if (userInfo) {
      this.setData({ userInfo, showLoginPrompt: false });
    } else {
      this.setData({ showLoginPrompt: true });
    }
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