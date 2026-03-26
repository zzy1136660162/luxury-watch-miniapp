Component({
  pageLifetimes: {
    show() {
      // 设置 tabBar 选中索引为 3（会员）
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(3);
      }
    }
  },

  data: {
    currentTab: 'all',
    memberPoints: '12,800',

    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDoQbVVmVmaVSpBYX6NpjKX1iSBAcllQK_xEIM7mLhh_hJIBVAe2-2jNvM6SBpYJB5WcVmi35nTjpORWRwvj5Ftzipsk8yXzngO0pGNNS4S7iGOCb1zKlwMN3OlXu-WmCIIso1cW9gNXxLW438SpDQyj0RRAPQ_uyQvqeCepghvffnLEHZnDv-aDSR1Xg0Te24r0kDYMbtXTgtANUUNCPNEwDZG0NCz8ZZ7bMc8L5HOqWgJiH0XQUX2CSZ-dzlOVhn7X4Tt6MHJb0x',

    reward1: {
      id: 'reward1',
      title: '高级鳄鱼皮定制表带',
      subtitle: 'Bespoke Exotic Leather Strap',
      points: '8,000',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiyLn9EArWOJ9HUTICJFpmMADfyC_MPED1KtEoyCjmuadlVwKMlPzBr8Q0dDlD0zNUOrC-cyTZ4EYoyt5Cxg43jFZAf3EeqNlApbnBPFioeEaELNHUPOLI4NDYm-lN0O3uNZFpATm8T7LI4GspvWCulHP84AImX0reYy_ai0ZJkFOpwsq-s8gQ7agtSbgt7TreXK-VrAhyUcGwL949xbGFNIj2xvblGy01G0USfTzqVb6W8cP-Wj8ob4zkFH2XodblrzOJ66KKoYhM'
    },

    reward2: {
      id: 'reward2',
      title: '品牌 200 周年纪念画册',
      subtitle: '200th Anniversary Anthology',
      points: '3,500',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBomNFJk7Vhtg2QWWgYrSjD3NQ_79RgcnmICvUKnU69keSr09sak0vgT21D31S3WYfDo97kV0HOF2g35iNoUp2moZiXWWfWUbk3yOIe06D16wqO-FQByANFyFmqisNwvzma_pd2Pl_w-ggrdVqBFHti2NigXjZY2RNq70JhOG1HL4ZbzVHHvf-WmtxxKd83Df-nQsQ3UeU6G9znUxoUZfurhkPnhRgiMB2EwCjWTE_UGa4kC13pfoyWqIxemZ9rvUjyDwaC2NPsNPvU'
    },

    reward3: {
      id: 'reward3',
      title: '线下新品私人品鉴会门票',
      subtitle: 'Private Collection Showcase Access',
      points: '15,000',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2n0SzLyFMW4sHJx5KWZyzaOn6-qoDJYh8p8FpCAB3kGau4PBDyBv4Wm2-AABwCd_TW5kZrPKSacQJizZszmY623C7IgZvhGRD1gAxXkb4rRGNwQxkcBLSH8RURaMxINmefuRB5htf8RuNsYN3z3OAYixJze3wvRKugSXgCukm9BPCptnkixZV1LHh884C4tr4_FytHZNNQcUJk-dWT_MbFoOmc3jbXCOYPKlC4XUbVa-xpPeZrkPUMMkYxB7o7Dz6lJGvcKb75dUI'
    }
  },

  methods: {
    onPrivilegeTap(e: any) {
      const type = e.currentTarget.dataset.type;
      wx.showModal({
        title: '尊享权益',
        content: `正在打开 ${type} 功能`,
        confirmText: '确定'
      });
    },

    onRewardTap(e: any) {
      const id = e.currentTarget.dataset.id;
      // 跳转到商品详情页
      wx.navigateTo({
        url: `/pages/product-detail/product-detail?id=${id}`
      });
    },

    onServiceTap(e: any) {
      const type = e.currentTarget.dataset.type;
      wx.showModal({
        title: '服务功能',
        content: `正在打开 ${type} 功能`,
        confirmText: '确定'
      });
    },

    onTabChange(e: any) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({ currentTab: tab });
    }
  }
});
