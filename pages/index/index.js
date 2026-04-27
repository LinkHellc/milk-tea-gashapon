const { brands } = require('../../data/brands.js');

Page({
  data: {
    brandPages: [],    // brands split into pages of 3 for swiper
    currentSwiperIndex: 0
  },

  onLoad() {
    // Split brands into pages of 3 for swiper (D-08: 3 per screen)
    const pages = [];
    for (let i = 0; i < brands.length; i += 3) {
      pages.push(brands.slice(i, i + 3));
    }
    this.setData({ brandPages: pages });
  },

  onBrandTap(e) {
    const brand = e.currentTarget.dataset.brand;
    wx.navigateTo({
      url: `/pages/gashapon/gashapon?brandId=${brand.id}&brandName=${encodeURIComponent(brand.name)}`
    });
  },

  onSwiperChange(e) {
    this.setData({ currentSwiperIndex: e.detail.current });
  }
});
