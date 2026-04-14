Component({
  data: {
    // 当前选中的索引，由页面通过 getTabBar 设置
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

  methods: {
    // 设置当前选中的索引（由页面调用）
    setSelectedIndex(index: number) {
      if (index === this.data.currentIndex) {
        return;
      }
      this.setData({
        currentIndex: index
      });
    },

    // 切换标签
    switchTab(e: any) {
      const index = Number(e.currentTarget.dataset.index);
      const item = this.data.list[index];

      // 如果已经是当前选中的，不执行任何操作
      if (index === this.data.currentIndex) {
        return;
      }

      // 更新选中状态
      this.setData({
        currentIndex: index
      });

      // 页面跳转
      wx.switchTab({
        url: item.pagePath
      });
    }
  }
});
