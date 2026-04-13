import { getFullImageUrl } from '../../utils/config';
import { productApi, collectionApi, homeApi } from '../../utils/request';

Component({
  pageLifetimes: {
    show() {
      // 设置 tabBar 选中索引为 1（系列）
      const tabBar = this.getTabBar();
      if (tabBar) {
        tabBar.setSelectedIndex(1);
      }
      // 页面显示时重新计算导航栏位置
      setTimeout(() => {
        this.calculateNavPosition();
      }, 100);
    }
  },

  data: {
    currentCategory: 'all',
    isNavFixed: false,
    navTop: 1000, // 初始值设置为很大的数，等待真实值计算

    // Hero轮播图
    heroImage: '',

    // 分类列表
    categories: [] as any[],

    // 当前分类的产品列表
    products: [] as any[],

    // 精选产品
    featuredProducts: [] as any[],

    // 分页
    page: 1,
    size: 10,
    total: 0,
    hasMore: true,

    // 加载状态
    loading: true
  },

  attached() {
    // 加载Hero图片
    this.loadHeroImage();
    // 加载分类数据
    this.loadCategories();
    // 加载精选产品
    this.loadFeaturedProducts();
    // 加载产品列表
    this.loadProducts();
    // 计算导航栏位置
    setTimeout(() => {
      this.calculateNavPosition();
    }, 300);
  },

  methods: {
    // 计算导航栏位置
    calculateNavPosition() {
      const query = wx.createSelectorQuery();
      query.select('#hero-banner').boundingClientRect();
      query.exec((res: any) => {
        if (res && res[0] && res[0].height > 0) {
          // hero-banner高度 + 1px 作为阈值
          const heroHeight = res[0].height;
          this.setData({
            navTop: heroHeight + 1
          });
          console.log('导航栏阈值设置:', heroHeight + 1);
        } else {
          // 如果获取不到，使用默认值（80vh 约等于屏幕高度的80%）
          const defaultHeight = wx.getSystemInfoSync().windowHeight * 0.8;
          this.setData({
            navTop: defaultHeight + 1
          });
          console.log('使用默认导航栏阈值:', defaultHeight + 1);
        }
      });
    },

    // 监听滚动事件
    onScroll(e: any) {
      const scrollTop = e.detail.scrollTop;
      const { navTop, isNavFixed } = this.data;

      if (scrollTop >= navTop && !isNavFixed) {
        this.setData({ isNavFixed: true });
      } else if (scrollTop < navTop && isNavFixed) {
        this.setData({ isNavFixed: false });
      }
    },

    // 加载Hero图片（使用系列页面专用图）
    async loadHeroImage() {
      try {
        const res: any = await homeApi.getHomeData();
        
        if (res.code === 200 && res.data) {
          const heroImage = res.data.collectionHeroImage ? getFullImageUrl(res.data.collectionHeroImage) : '';
          this.setData({ heroImage }, () => {
            // 图片加载后重新计算导航栏位置
            setTimeout(() => {
              this.calculateNavPosition();
            }, 100);
          });
        }
      } catch (error) {
        console.error('加载Hero图片失败:', error);
      }
    },

    // 加载分类数据
    async loadCategories() {
      try {
        const res: any = await collectionApi.getAllCollections();
        
        if (res.code === 200) {
          this.setData({
            categories: res.data || []
          });
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },

    // 加载精选产品
    async loadFeaturedProducts() {
      try {
        const res: any = await productApi.getFeatured();
        
        if (res.code === 200) {
          const featuredProducts = (res.data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            nameEn: item.nameEn,
            intro: item.intro,
            code: item.code,
            price: item.price,
            image: getFullImageUrl(item.image)
          }));
          
          this.setData({ featuredProducts });
        }
      } catch (error) {
        console.error('加载精选产品失败:', error);
      }
    },

    // 加载产品列表
    async loadProducts(refresh = false) {
      try {
        if (refresh) {
          this.setData({ page: 1, products: [], hasMore: true });
        }
        
        if (!this.data.hasMore) return;
        
        this.setData({ loading: true });
        
        const res: any = await productApi.getOnlineList({
          page: this.data.page,
          size: this.data.size,
          category: this.data.currentCategory
        });
        
        if (res.code === 200) {
          const data = res.data;
          const newProducts = (data.list || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            nameEn: item.nameEn,
            intro: item.intro,
            code: item.code,
            price: item.price,
            image: getFullImageUrl(item.image),
            category: item.category
          }));
          
          this.setData({
            products: refresh ? newProducts : [...this.data.products, ...newProducts],
            total: data.total,
            hasMore: this.data.products.length + newProducts.length < data.total,
            loading: false
          });
        } else {
          this.setData({ loading: false });
        }
      } catch (error) {
        console.error('加载产品失败:', error);
        this.setData({ loading: false });
      }
    },

    // 分类点击
    onCategoryTap(e: any) {
      const category = e.currentTarget.dataset.category;
      console.log('点击分类按钮:', category);
      
      this.setData({
        currentCategory: category,
        page: 1,
        products: [],
        hasMore: true
      }, () => {
        this.loadProducts(true);
      });
    },

    // 产品点击
    onProductTap(e: any) {
      const productId = e.currentTarget.dataset.id;
      if (productId) {
        wx.navigateTo({
          url: `/pages/product-detail/product-detail?id=${productId}`
        });
      }
    },

    // 请求目录
    onRequestCatalogue() {
      wx.showModal({
        title: '产品目录',
        content: '正在为您准备产品目录，请稍候...',
        confirmText: '确定'
      });
    },

    // 查找精品店
    onLocateBoutique() {
      wx.showModal({
        title: '精品店定位',
        content: '正在查找附近的精品店...',
        confirmText: '确定'
      });
    },

    // 下拉加载更多
    onReachBottom() {
      if (!this.data.loading && this.data.hasMore) {
        this.setData({
          page: this.data.page + 1
        }, () => {
          this.loadProducts();
        });
      }
    },

    // 下拉刷新
    onPullDownRefresh() {
      Promise.all([
        this.loadCategories(),
        this.loadFeaturedProducts(),
        this.loadProducts(true)
      ]).then(() => {
        wx.stopPullDownRefresh();
      });
    }
  }
});
