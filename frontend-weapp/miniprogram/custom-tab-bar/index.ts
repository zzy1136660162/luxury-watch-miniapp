Component({
  data: {
    num1: 1, // 首页按钮状态: 1=高亮, 2=灰色
    num2: 2, // 系列按钮状态: 1=高亮, 2=灰色
    num3: 2, // 品牌馆按钮状态: 1=高亮, 2=灰色
    num4: 2, // 会员按钮状态: 1=高亮, 2=灰色
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
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIyeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg0K'
      },
      {
        pagePath: '/pages/heritage/heritage',
        text: '品牌馆',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo=',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0BveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo='
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

  lifetimes: {
    attached() {
      this.updateSelectedTab();
    }
  },

  methods: {
    updateSelectedTab() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) {
        return;
      }
      
      const currentPage = pages[pages.length - 1];
      if (!currentPage || !currentPage.route) {
        return;
      }
      
      const currentPath = '/' + currentPage.route;
      console.log('当前页面路径:', currentPath);
      
      const selectedIndex = this.data.list.findIndex(item => item.pagePath === currentPath);
      console.log('找到的索引:', selectedIndex);
      
      if (selectedIndex >= 0) {
        this.setButtonState(selectedIndex);
      } else {
        // 如果没有找到匹配的页面，默认选中首页
        this.setButtonState(0);
      }
    },

    setButtonState(activeIndex: number) {
      // 将索引转换为数字，确保类型正确
      const index = Number(activeIndex);
      console.log('setButtonState 接收到的索引:', activeIndex, '转换后:', index);
      
      // 使用对象展开运算符创建新状态，避免引用问题
      let newState: any = {};
      
      // 根据索引设置对应按钮为高亮，其他为灰色
      if (index === 0) {
        newState = { num1: 1, num2: 2, num3: 2, num4: 2 };
      } else if (index === 1) {
        newState = { num1: 2, num2: 1, num3: 2, num4: 2 };
      } else if (index === 2) {
        newState = { num1: 2, num2: 2, num3: 1, num4: 2 };
      } else if (index === 3) {
        newState = { num1: 2, num2: 2, num3: 2, num4: 1 };
      } else {
        // 默认情况，所有按钮灰色
        newState = { num1: 2, num2: 2, num3: 2, num4: 2 };
      }
      
      console.log('设置新状态:', newState);
      this.setData(newState);
    },

    switchTab(e: any) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];
      
      console.log('点击按钮索引:', index);
      console.log('当前状态: num1=', this.data.num1, 'num2=', this.data.num2, 'num3=', this.data.num3, 'num4=', this.data.num4);
      
      // 如果已经是当前选中的页面，则不执行任何操作
      const currentActive = this.getCurrentActiveIndex();
      console.log('当前选中的索引:', currentActive);
      
      if (currentActive === index) {
        console.log('已经是当前选中的页面，跳过');
        return;
      }
      
      // 更新按钮状态
      console.log('更新按钮状态到索引:', index);
      this.setButtonState(index);
      
      if (item.type === 'tab') {
        wx.switchTab({
          url: item.pagePath
        });
      } else {
        wx.navigateTo({
          url: item.pagePath
        });
      }
    },

    getCurrentActiveIndex(): number {
      if (this.data.num1 === 1) return 0;
      if (this.data.num2 === 1) return 1;
      if (this.data.num3 === 1) return 2;
      if (this.data.num4 === 1) return 3;
      return 0; // 默认返回首页
    }
  },

  pageLifetimes: {
    show() {
      this.updateSelectedTab();
    }
  }
});