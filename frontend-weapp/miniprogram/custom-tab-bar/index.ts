Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/home/home',
        text: '首页',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxtZXRhZGF0YSBmaWxsPSIjNTdlNmZmIiBtZXRhZGF0YSBzdHJva2Utd2lkdGg9IjIiIG1ldGFkYXRhIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgbWV0YWRhdGEgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48cGF0aCBkPSJNIDEyIDIgMiAyMCAxMCAyMCAxMiA4Ii8+PHBhdGggZD0iTSA3IDIgMiAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxMCAxOCIvPjxwYXRoIGQ9Ik0gMjIgMiAyMCAyMCAxNCAxOCIvPjxwYXRoIGQ9Ik0gMiAyMCAyMCAyMCAxNCAxOCIvPjwvc3ZnPg=='
      },
      {
        pagePath: '/pages/collections/collections',
        text: '系列',
        iconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1ZDVlNWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg==',
        selectedIconPath: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRDRBRjM3Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNIDE1LjUgNiA4LjUgMTIgMTUuNSAxOCA4LjUgMTIuNSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMTIgNy41IDggMTIuNSAxMiAxOCAxNiA3LjUgMTIuNSI+PC9wYXRoPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjguNSIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iMTUuNSIgeTI9IjE4Ij48L2xpbmU+PGxpbmUgeDE9IjguNSIgeTE9IjEyIiB4Mj0iOC41IiB5Mj0iMTIuNSI+PC9saW5lPjxsaW5lIHgxPSIxNS41IiB5MT0iNiIgeDI9IjE1LjUiIHkyPSIxOCI+PC9saW5lPjwvc3ZnPg=='
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
      const currentPage = pages[pages.length - 1];
      const currentPath = '/' + currentPage.route;
      
      const selected = this.data.list.findIndex(item => item.pagePath === currentPath);
      this.setData({
        selected: selected >= 0 ? selected : 0
      });
    },

    switchTab(e: any) {
      const index = e.currentTarget.dataset.index;
      const pagePath = this.data.list[index].pagePath;
      
      wx.switchTab({
        url: pagePath,
        success: () => {
          this.setData({
            selected: index
          });
        }
      });
    }
  },

  pageLifetimes: {
    show() {
      this.updateSelectedTab();
    }
  }
});
