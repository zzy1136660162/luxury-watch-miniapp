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

    // 品牌列表
    brands: [] as string[],

    // 当前品牌
    currentBrand: 'all',

    // 当前分类的产品列表
    products: [] as any[],

    // 精选产品列表（用于避免重复显示）
    featuredProducts: [] as any[],

    // 系列列表
    categorySeries: [] as { brand: string; series: string; logo?: string }[],
    
    // 所有系列列表（原始数据）
    allSeriesList: [] as { brand: string; series: string; logo?: string }[],

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
    // 加载品牌列表（会同时加载第一个品牌的产品和系列列表）
    this.loadBrands();
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

    // 加载品牌列表
    async loadBrands() {
      try {
        const res: any = await productApi.getAllBrands();
        
        if (res.code === 200) {
          const brands = res.data || [];
          // 默认选中第一个品牌
          const defaultBrand = brands.length > 0 ? brands[0] : 'all';
          this.setData({
            brands: brands,
            currentBrand: defaultBrand
          });
          console.log('加载品牌列表:', brands, '默认选中:', defaultBrand);
          // 如果有默认品牌，重新加载产品列表
          if (defaultBrand !== 'all') {
            this.loadProducts(true);
          }
          // 加载系列列表（使用当前的 currentBrand 进行过滤）
          this.loadCategorySeries();
        }
      } catch (error) {
        console.error('加载品牌列表失败:', error);
      }
    },

    // 加载系列列表
    async loadCategorySeries() {
      try {
        const res: any = await productApi.getAllSeriesList();
        
        if (res.code === 200 && res.data) {
          const allSeries = res.data;
          // 处理logo字段，添加完整URL
          allSeries.forEach((item: any) => {
            if (item.logo) {
              item.logo = getFullImageUrl(item.logo);
            }
          });
          // 根据当前品牌过滤系列
          const currentBrand = this.data.currentBrand;
          const filteredSeries = currentBrand === 'all' 
            ? allSeries 
            : allSeries.filter((item: { brand: string; series: string; logo?: string }) => item.brand === currentBrand);
          
          this.setData({ 
            categorySeries: filteredSeries,
            allSeriesList: allSeries // 保存完整列表用于切换品牌时使用
          });
        }
      } catch (error) {
        console.error('加载系列列表失败:', error);
      }
    },

    // 系列项点击
    onSeriesItemTap(e: any) {
      const brand = e.currentTarget.dataset.brand;
      const series = e.currentTarget.dataset.series;
      wx.navigateTo({
        url: `/pages/search-result/search-result?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(series)}`
      });
    },

    // 加载产品列表
    async loadProducts(refresh = false) {
      try {
        if (refresh) {
          this.setData({ page: 1, products: [], hasMore: true });
        }
        
        if (!this.data.hasMore) return;
        
        this.setData({ loading: true });
        
        const params: any = {
          page: this.data.page,
          size: this.data.size
        };
        
        if (this.data.currentCategory !== 'all') {
          params.category = this.data.currentCategory;
        }
        
        if (this.data.currentBrand !== 'all') {
          params.brand = this.data.currentBrand;
        }
        
        const res: any = await productApi.getOnlineList(params);
        
        if (res.code === 200) {
          const data = res.data;
          let newProducts = (data.list || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            nameEn: item.nameEn,
            intro: item.intro,
            code: item.code,
            price: item.price,
            image: getFullImageUrl(item.image),
            category: item.category,
            series: item.series || ''
          }));
          
          // 过滤掉精选商品，避免重复显示
          if (this.data.featuredProducts.length > 0 && this.data.currentCategory === 'all') {
            const featuredIds = new Set(this.data.featuredProducts.map((item: any) => item.id));
            newProducts = newProducts.filter((item: any) => !featuredIds.has(item.id));
          }
          
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

    // 搜索点击
    onSearchTap() {
      wx.navigateTo({
        url: '/pages/search/search'
      });
    },

    // 品牌点击
    onBrandTap(e: any) {
      const brand = e.currentTarget.dataset.brand;
      console.log('点击品牌按钮:', brand);
      
      // 根据当前品牌过滤系列列表
      const allSeries = this.data.allSeriesList;
      const filteredSeries = brand === 'all' 
        ? allSeries 
        : allSeries.filter((item: { brand: string; series: string; logo?: string }) => item.brand === brand);
      
      this.setData({
        currentBrand: brand,
        categorySeries: filteredSeries,
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
        this.loadCategorySeries(),
        this.loadProducts(true)
      ]).then(() => {
        wx.stopPullDownRefresh();
      });
    }
  }
});
