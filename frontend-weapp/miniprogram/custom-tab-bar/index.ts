Component({
  data: {
    // 当前选中的索引，由页面通过 getTabBar 设置
    currentIndex: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: '首页',
        iconPath: '/assets/iconfont/首页 (1).png',
        selectedIconPath: '/assets/iconfont/首页.png'
      },
      {
        pagePath: '/pages/collections/collections',
        text: '系列',
        iconPath: '/assets/iconfont/配饰-手表-线性 (1).png',
        selectedIconPath: '/assets/iconfont/配饰-手表-线性.png'
      },
      {
        pagePath: '/pages/heritage/heritage',
        text: '品牌馆',
        iconPath: '/assets/iconfont/签到，羽毛，笔，毛笔，羽毛笔 (1).png',
        selectedIconPath: '/assets/iconfont/签到，羽毛，笔，毛笔，羽毛笔.png'
      },
      {
        pagePath: '/pages/member/member',
        text: '会员',
        iconPath: '/assets/iconfont/038_我的8 (1).png',
        selectedIconPath: '/assets/iconfont/038_我的8.png'
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
