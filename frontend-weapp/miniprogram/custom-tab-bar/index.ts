Component({
  data: {
    currentIndex: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: '首页',
        iconPath: '/assets/iconfont/home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png',
        selectedIconPath: '/assets/iconfont/home_24dp_D4AF37_FILL0_wght400_GRAD0_opsz24.png'
      },
      {
        pagePath: '/pages/collections/collections',
        text: '系列',
        iconPath: '/assets/iconfont/watch_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png',
        selectedIconPath: '/assets/iconfont/watch_24dp_D4AF37_FILL0_wght400_GRAD0_opsz24.png'
      },
      {
        pagePath: '/pages/privileges/privileges',
        text: '礼遇',
        iconPath: '/assets/iconfont/history_edu_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png',
        selectedIconPath: '/assets/iconfont/history_edu_24dp_D4AF37_FILL0_wght400_GRAD0_opsz24.png'
      },
      {
        pagePath: '/pages/member/member',
        text: '会员',
        iconPath: '/assets/iconfont/person_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png',
        selectedIconPath: '/assets/iconfont/person_24dp_D4AF37_FILL0_wght400_GRAD0_opsz24.png'
      }
    ]
  },

  lifetimes: {
    attached() {
      this.init();
    },
    ready() {
      this.init();
    }
  },

  pageLifetimes: {
    show() {
      this.init();
    },
    resize() {
      this.init();
    }
  },

  methods: {
    init() {
      // 获取当前页面栈，设置对应的索引
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route;
        
        const index = this.data.list.findIndex(item => item.pagePath === '/' + route);
        if (index !== -1 && index !== this.data.currentIndex) {
          this.setData({ currentIndex: index });
        }
      }
    },

    setSelectedIndex(index: number) {
      if (index === this.data.currentIndex) {
        return;
      }
      this.setData({
        currentIndex: index
      });
    },

    switchTab(e: any) {
      const index = Number(e.currentTarget.dataset.index);
      const item = this.data.list[index];

      if (index === this.data.currentIndex) {
        return;
      }

      this.setData({
        currentIndex: index
      });

      wx.switchTab({
        url: item.pagePath,
        fail: () => {
          // 如果 switchTab 失败，尝试使用 reLaunch
          wx.reLaunch({
            url: item.pagePath
          });
        }
      });
    }
  }
})
