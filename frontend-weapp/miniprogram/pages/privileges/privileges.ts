import { userApi, rewardApi } from '../../utils/request';
import { getFullImageUrl } from '../../utils/config';

Component({
  pageLifetimes: {
    show() {
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(2);
      }
      this.loadUserPoints();
      this.loadRedeemableProducts();
    }
  },

  data: {
    memberPoints: '0',
    isLoggedIn: false,

    heroImage: '',

    products: [] as any[]
  },

  methods: {
    async loadUserPoints() {
      try {
        const token = wx.getStorageSync('token');
        if (!token) {
          this.setData!({
            isLoggedIn: false,
            memberPoints: '0'
          });
          return;
        }

        const res: any = await userApi.getCurrentUser();
        if (res && res.code === 200) {
          const points = res.data?.points || 0;
          this.setData!({
            isLoggedIn: true,
            memberPoints: points.toLocaleString()
          });
        }
      } catch (err) {
        console.error('获取用户积分失败:', err);
        this.setData!({
          isLoggedIn: false,
          memberPoints: '0'
        });
      }
    },

    async loadRedeemableProducts() {
      try {
        const res: any = await rewardApi.getRedeemableProducts();
        if (res && res.code === 200 && res.data) {
          const products = res.data.map((item: any) => ({
            id: item.id,
            tag: item.category || '积分礼品',
            title: item.name,
            desc: item.description || '暂无描述',
            points: item.pointsCost?.toLocaleString() || '0',
            image: getFullImageUrl(item.image)
          }));

          this.setData!({
            products: products
          });
        }
      } catch (err) {
        console.error('获取积分商品列表失败:', err);
        wx.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      }
    },

    onProductTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      const product = this.data.products.find((p: any) => p.id === productId);
      if (product) {
        const encodedData = encodeURIComponent(JSON.stringify(product));
        wx.navigateTo({
          url: `/pages/reward-detail/reward-detail?data=${encodedData}`
        });
      }
    },

    onRedeem(e: any) {
      const productId = e.currentTarget.dataset.id;
      const product = this.data.products.find((p: any) => p.id === productId);
      if (product) {
        const encodedData = encodeURIComponent(JSON.stringify(product));
        wx.navigateTo({
          url: `/pages/reward-detail/reward-detail?data=${encodedData}`
        });
      }
    },

    onImageError(e: any) {
      const index = e.target?.dataset?.index;
      if (index !== undefined) {
        const products = [...this.data.products];
        if (products[index]) {
          products[index].image = '';
          this.setData!({ products });
        }
      } else if (e.target?.dataset?.type === 'hero') {
        this.setData!({
          heroImage: ''
        });
      }
    },

    onViewExchangeRecords() {
      wx.navigateTo({
        url: '/pages/exchange-records/exchange-records'
      });
    }
  }
});
