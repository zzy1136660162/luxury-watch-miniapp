Component({
  data: {
    // 布尔值控制高亮状态，初始只有首页为true
    isHomeActive: true,
    isSeriesActive: false,
    isBrandActive: false,
    isMemberActive: false,
    // 当前选中的索引，用于避免重复setData
    currentIndex: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: '首页',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxtZXRhZGF0YSBmaWxsPSIjNTdlNmZmIiBtZXRhZGF0YSBzdHJva2Utd2lkdGg9IjIiIG1ldGFkYXRhIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgbWV0YWRhdGEgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI4IiBmaWxsPSIjRDRBRjM3Ij48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMjIgMiAyMCAyMCAxNCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxNCAxOCIvPjwvc3ZnPg0K'
      },
      {
        pagePath: '/pages/collections/collections',
        text: '系列',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg0K'
      },
      {
        pagePath: '/pages/heritage/heritage',
        text: '品牌馆',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo=',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo='
      },
      {
        pagePath: '/pages/member/member',
        text: '会员',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0gMjAgMjAgMjAgMjAgMTIgMTYiPjwvcGF0aD48bGluZSB4MT0iMiIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSIyMCIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIyMCI+PC9saW5lPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0gMjAgMjAgMjAgMjAgMTIgMTYiPjwvcGF0aD48bGluZSB4MT0iMiIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSIyMCIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIyMCI+PC9saW5lPjwvc3ZnPg0K'
      }
    ]
  },

  pageLifetimes: {
    show() {
      // 页面显示时，根据当前路径动态初始化选中状态
      this.initActiveStateByPath();
    }
  },

  methods: {
    // 根据当前页面路径初始化选中状态
    initActiveStateByPath() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) {
        return;
      }

      const currentPage = pages[pages.length - 1];
      if (!currentPage || !currentPage.route) {
        return;
      }

      // 去除查询参数，只保留路径部分
      const route = currentPage.route.split('?')[0];
      const currentPath = '/' + route;
      const pathMap: { [key: string]: number } = {
        '/pages/home/home': 0,
        '/pages/collections/collections': 1,
        '/pages/heritage/heritage': 2,
        '/pages/member/member': 3
      };

      const index = pathMap[currentPath];
      if (index !== undefined && index !== this.data.currentIndex) {
        this.setActiveState(index);
      }
    },

    // 设置选中状态（避免重复setData）
    setActiveState(index: number) {
      // 如果已经是当前选中的，直接返回
      if (index === this.data.currentIndex) {
        return;
      }

      // 根据索引设置对应状态
      if (index === 0) {
        this.setData({
          isHomeActive: true,
          isSeriesActive: false,
          isBrandActive: false,
          isMemberActive: false,
          currentIndex: 0
        });
      } else if (index === 1) {
        this.setData({
          isHomeActive: false,
          isSeriesActive: true,
          isBrandActive: false,
          isMemberActive: false,
          currentIndex: 1
        });
      } else if (index === 2) {
        this.setData({
          isHomeActive: false,
          isSeriesActive: false,
          isBrandActive: true,
          isMemberActive: false,
          currentIndex: 2
        });
      } else if (index === 3) {
        this.setData({
          isHomeActive: false,
          isSeriesActive: false,
          isBrandActive: false,
          isMemberActive: true,
          currentIndex: 3
        });
      }
    },

    // 切换标签
    switchTab(e: any) {
      const index = Number(e.currentTarget.dataset.index);
      const item = this.data.list[index];

      // 如果已经是当前选中的，不执行任何操作
      if (index === this.data.currentIndex) {
        return;
      }

      // 设置选中状态，并在回调中执行页面跳转
      this.setActiveStateWithCallback(index, () => {
        // 页面跳转
        if (item.type === 'tab') {
          wx.switchTab({
            url: item.pagePath
          });
        } else {
          wx.navigateTo({
            url: item.pagePath
          });
        }
      });
    },

    // 设置选中状态并执行回调（确保状态更新完成后再跳转）
    setActiveStateWithCallback(index: number, callback: () => void) {
      // 如果已经是当前选中的，直接执行回调
      if (index === this.data.currentIndex) {
        callback();
        return;
      }

      let newData: any = { currentIndex: index };

      if (index === 0) {
        newData = {
          ...newData,
          isHomeActive: true,
          isSeriesActive: false,
          isBrandActive: false,
          isMemberActive: false
        };
      } else if (index === 1) {
        newData = {
          ...newData,
          isHomeActive: false,
          isSeriesActive: true,
          isBrandActive: false,
          isMemberActive: false
        };
      } else if (index === 2) {
        newData = {
          ...newData,
          isHomeActive: false,
          isSeriesActive: false,
          isBrandActive: true,
          isMemberActive: false
        };
      } else if (index === 3) {
        newData = {
          ...newData,
          isHomeActive: false,
          isSeriesActive: false,
          isBrandActive: false,
          isMemberActive: true
        };
      }

      // 使用setData回调确保状态更新完成后再跳转
      this.setData(newData, callback);
    }
  }
});
