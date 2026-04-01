Component({
  pageLifetimes: {
    show() {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(2);
      }
    }
  },

  data: {
    heroImage: 'http://localhost:8081/api/images/unnamed%20(5).png',

    milestone1: {
      year: '1792',
      event: '传奇诞生',
      desc: '在瑞士汝拉山谷的深处，第一间钟表工坊正式创立，开启了长达两个世纪的制表传奇。',
      descEn: 'The Foundation in Jura Valley',
      image: 'http://localhost:8081/api/images/unnamed%20(12).png'
    },

    milestone2: {
      year: '1924',
      event: '复杂功能的突破',
      desc: '首款具备万年历功能的腕表问世，打破了当时精密机械小型化的技术瓶颈。',
      descEn: 'Perpetual Calendar Breakthrough',
      image: 'http://localhost:8081/api/images/unnamed%20(10).png'
    },

    milestone3: {
      year: '2024',
      event: '致敬未来',
      desc: '融合钛金属材质与超薄机芯，CHRONOS 再次定义了现代奢华时计的标准。',
      descEn: 'Redefining Modern Luxury',
      image: 'http://localhost:8081/api/images/unnamed(11).png'
    },

    craft1: {
      image: 'http://localhost:8081/api/images/unnamed%20(6).png'
    },

    craft2: {
      image: 'http://localhost:8081/api/images/unnamed%20(7).png'
    },

    craft3: {
      image: 'http://localhost:8081/api/images/unnamed%20(13).png'
    },

    craft4: {
      image: 'http://localhost:8081/api/images/unnamed(14).png'
    },

    collectionsImage: 'http://localhost:8081/api/images/unnamed%20(8).png'
  },

  methods: {
    onDiscover() {
      wx.showModal({
        title: '探索更多',
        content: '即将推出更多精彩内容',
        confirmText: '确定'
      });
    },

    onExploreCollections() {
      wx.switchTab({
        url: '/pages/collections/collections'
      });
    },

    onImageError(e: any) {
      console.error('图片加载失败:', e.detail);
      const src = e.detail?.errMsg?.match(/src:\s*(.+)/)?.[1] || e.target?.dataset?.src || 'unknown';
      console.log('失败的图片:', src);
    }
  }
});
