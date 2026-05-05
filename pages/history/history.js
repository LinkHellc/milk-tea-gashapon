const { brands } = require('../../data/brands.js');

Page({
  data: {
    history: [],
    page: 0,
    limit: 20,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadHistory();
  },

  loadHistory() {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getUserData',
      success: (res) => {
        if (res.result && res.result.success) {
          const userData = res.result.data;
          const history = (userData.history || []).map(item => {
            const brand = brands.find(b => b.id === item.brandId) || {};
            return {
              ...item,
              brandName: brand.name || item.brandId,
              timeStr: this.formatTime(item.timestamp)
            };
          });
          this.setData({
            history,
            hasMore: false
          });
        }
      },
      fail: (err) => {
        console.error('getHistory failed:', err);
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hour}:${min}`;
  },

  goDraw() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  onShareAppMessage() {
    return {
      title: '今天喝什么 - 抽取历史',
      path: '/pages/history/history'
    };
  }
});
