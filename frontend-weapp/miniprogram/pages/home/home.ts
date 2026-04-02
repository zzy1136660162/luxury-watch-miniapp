import { getFullImageUrl } from '../../utils/config';
import { homeApi } from '../../utils/request';

Component({
  pageLifetimes: {
    show() {
      // 设置 tabBar 选中索引为 0（首页）
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(0);
      }
    }
  },

  data: {
    scrollLeft: 0,

    // Hero轮播图
    heroImage: '',

    // 品牌故事图片
    brandStoryImage: '',

    // 新品推荐
    newArrivals: [] as any[],

    // 精选商品
    featuredProducts: [] as any[],

    // 热门系列（改为商品展示）
    hotSeries: [] as any[],

    // 加载状态
    loading: true
  },

  attached() {
    // 加载首页数据
    this.loadHomeData();
  },

  methods: {
    // 加载首页数据
    async loadHomeData() {
      try {
        this.setData({ loading: true });
        
        const res: any = await homeApi.getHomeData();
        
        if (res.code === 200) {
          const data = res.data;
          
          // 处理新品推荐图片
          const newArrivals = (data.newArrivals || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: getFullImageUrl(item.image),
            tag: item.category || '新品推荐'
          }));
          
          // 处理精选商品图片
          const featuredProducts = (data.featuredProducts || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: getFullImageUrl(item.image),
            category: item.category
          }));
          
          // 处理热门系列（商品）
          const hotSeries = (data.hotSeries || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: getFullImageUrl(item.image),
            description: item.description || item.name
          }));
          
          // 处理Hero图和品牌故事图片（如果有的话）
          const heroImage = data.heroImage ? getFullImageUrl(data.heroImage) : '';
          const brandStoryImage = data.brandStoryImage ? getFullImageUrl(data.brandStoryImage) : '';
          
          this.setData({
            newArrivals,
            featuredProducts,
            hotSeries,
            heroImage,
            brandStoryImage,
            loading: false
          });
          
          console.log('首页数据加载成功', {
            newArrivals: newArrivals.length,
            featuredProducts: featuredProducts.length,
            hotSeries: hotSeries.length
          });
        } else {
          console.error('API返回错误:', res.msg);
          this.showError();
        }
      } catch (error) {
        console.error('加载首页数据失败:', error);
        this.showError();
      }
    },

    // 显示错误提示
    showError() {
      this.setData({ loading: false });
      wx.showToast({
        title: '数据加载失败，请下拉刷新',
        icon: 'none',
        duration: 2000
      });
    },

    // 处理新品推荐点击
    onProductTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      if (productId) {
        wx.navigateTo({
          url: `/pages/product-detail/product-detail?id=${productId}`
        });
      }
    },

    // 处理热门系列点击
    onHotSeriesTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      if (productId) {
        wx.navigateTo({
          url: `/pages/product-detail/product-detail?id=${productId}`
        });
      }
    },

    onExploreHeritage() {
      wx.switchTab({
        url: '/pages/heritage/heritage'
      });
    },

    onContactConsultant() {
      wx.showModal({
        title: '尊享顾问服务',
        content: '我们的专家将尽快与您联系',
        confirmText: '确定'
      });
    },

    onScrollLeft() {
      const query = this.createSelectorQuery();
      query.select('#collectionsScroll').scrollOffset();
      query.exec((res) => {
        if (res && res[0]) {
          const currentScrollLeft = res[0].scrollLeft;
          const newScrollLeft = Math.max(0, currentScrollLeft - 300);
          this.setData({ scrollLeft: newScrollLeft });
        }
      });
    },

    onScrollRight() {
      const query = this.createSelectorQuery();
      query.select('#collectionsScroll').scrollOffset();
      query.exec((res) => {
        if (res && res[0]) {
          const currentScrollLeft = res[0].scrollLeft;
          this.setData({ scrollLeft: currentScrollLeft + 300 });
        }
      });
    },

    onCollectionScroll(e: any) {
      const scrollLeft = e.detail.scrollLeft;
      this.setData({ scrollLeft: scrollLeft });
    },

    // 下拉刷新
    onPullDownRefresh() {
      this.loadHomeData().then(() => {
        wx.stopPullDownRefresh();
      });
    }
  }
});
