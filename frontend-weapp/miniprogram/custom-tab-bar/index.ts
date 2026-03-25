Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: '首页',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxtZXRhZGF0YSBmaWxsPSIjNTdlNmZmIiBtZXRhZGF0YSBzdHJva2Utd2lkdGg9IjIiIG1ldGFkYXRhIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgbWV0YWRhdGEgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMjIgMiAyMCAyMCAxNCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxNCAxOCIvPjwvc3ZnPg0K'
      },
      {
        pagePath: '/pages/collections/collections',
        text: '系列',
        type: 'tab',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg0K'
      },
      {
        pagePath: '/pages/heritage/heritage',
        text: '品牌馆',
        type: 'navigate',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo=',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PHJlY3QgeD0iMiIgeT0iMTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSI2IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjE0IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSIxNCIgeDI9IjE4IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iMTgiIHkxPSI2IiB4Mj0iNiIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+DQo='
      },
      {
        pagePath: '/pages/member/member',
        text: '会员',
        type: 'navigate',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0gMjAgMjAgMjAgMjAgMTIgMTYiPjwvcGF0aD48bGluZSB4MT0iMiIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSIyMCIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIyMCI+PC9saW5lPjwvc3ZnPg0K',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0gMjAgMjAgMjAgMjAgMTIgMTYiPjwvcGF0aD48bGluZSB4MT0iMiIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIxOCI+PC9saW5lPjxsaW5lIHgxPSIyMCIgeTE9IjE4IiB4Mj0iMjAiIHkyPSIyMCI+PC9saW5lPjwvc3ZnPg0K'
      }
    ]
  },

  lifetimes: {
    attached() {
      setTimeout(() => {
        this.updateSelectedTab();
      }, 100);
    }
  },

  methods: {
    updateSelectedTab() {
      const pages = getCurrentPages();
      if (!pages || pages.length === 0) {
        return;
      }
      
      const currentPage = pages[pages.length - 1];
      if (!currentPage) {
        return;
      }
      
      const currentPath = '/' + currentPage.route;
      
      const selected = this.data.list.findIndex(item => item.pagePath === currentPath);
      this.setData({
        selected: selected >= 0 ? selected : 0
      });
    },

    switchTab(e: any) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.list[index];
      
      if (item.type === 'tab') {
        wx.switchTab({
          url: item.pagePath,
          success: () => {
            this.setData({
              selected: index
            });
          }
        });
      } else {
        wx.navigateTo({
          url: item.pagePath,
          success: () => {
            this.setData({
              selected: index
            });
          }
        });
      }
    }
  },

  pageLifetimes: {
    show() {
      setTimeout(() => {
        this.updateSelectedTab();
      }, 100);
    }
  }
});
