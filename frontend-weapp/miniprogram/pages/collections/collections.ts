import { getFullImageUrl } from '../../utils/config';
import { productApi, collectionApi, homeApi } from '../../utils/request';

const BOTTOM_ACTIVE_THRESHOLD = 8;
const CLEAR_SCROLL_ANCHOR_DELAY = 300;
const RELEASE_MANUAL_SELECT_DELAY = 700;

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

    // 当前品牌（用于高亮左侧导航）
    currentBrand: '',
    // 用户手动点击侧边栏后，短时间锁定选中态，避免滚动回调抖动覆盖
    manualSelectBrand: '',

    // 滚动到指定位置
    scrollIntoView: '',

    // 按品牌分组的系列列表
    brandSeriesList: [] as { brand: string; series: { name: string; logo?: string }[] }[],

    // 加载状态
    loading: true
  },

  attached() {
    // 加载Hero图片
    this.loadHeroImage();
    // 加载分类数据
    this.loadCategories();
    // 加载品牌列表和系列列表
    this.loadBrandsAndSeries();
    // 计算导航栏位置
    setTimeout(() => {
      this.calculateNavPosition();
    }, 300);
  },

  methods: {
    setCurrentBrand(brand: string) {
      if (brand && brand !== this.data.currentBrand) {
        this.setData({ currentBrand: brand });
      }
    },

    releaseManualSelectBrand(brand: string) {
      setTimeout(() => {
        if (this.data.manualSelectBrand === brand) {
          this.setData({ manualSelectBrand: '' });
        }
      }, RELEASE_MANUAL_SELECT_DELAY);
    },

    clearScrollIntoViewLater() {
      setTimeout(() => {
        this.setData({ scrollIntoView: '' });
      }, CLEAR_SCROLL_ANCHOR_DELAY);
    },

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
      const scrollHeight = e.detail.scrollHeight || 0;
      const clientHeight = e.detail.clientHeight || 0;
      const { navTop, isNavFixed } = this.data;

      if (scrollTop >= navTop && !isNavFixed) {
        this.setData({ isNavFixed: true });
      } else if (scrollTop < navTop && isNavFixed) {
        this.setData({ isNavFixed: false });
      }

      // 根据滚动位置更新当前选中的品牌
      this.updateCurrentBrandByScroll(scrollTop, scrollHeight, clientHeight);
    },

    // 根据滚动位置更新当前品牌
    updateCurrentBrandByScroll(scrollTop: number, scrollHeight: number, clientHeight: number) {
      const { brandSeriesList, manualSelectBrand } = this.data;
      if (brandSeriesList.length === 0) return;
      if (manualSelectBrand) return;

      // 滚动到底部附近时，强制选中最后一个品牌，避免最后一组被误判成倒数第二组
      if (scrollHeight > 0 && clientHeight > 0 && scrollTop + clientHeight >= scrollHeight - BOTTOM_ACTIVE_THRESHOLD) {
        const lastBrand = brandSeriesList[brandSeriesList.length - 1]?.brand;
        this.setCurrentBrand(lastBrand);
        return;
      }

      // 获取每个品牌区域的位置
      const query = wx.createSelectorQuery().in(this);
      brandSeriesList.forEach((_, index) => {
        query.select(`#brand-${index}`).boundingClientRect();
      });

      query.exec((res: any[]) => {
        if (!res || res.length === 0) return;

        // 找到当前在视口中的品牌
        for (let i = 0; i < res.length; i++) {
          const rect = res[i];
          if (rect && rect.top <= 150 && rect.bottom >= 150) {
            const brand = brandSeriesList[i]?.brand;
            this.setCurrentBrand(brand);
            break;
          }
        }
      });
    },

    // 加载品牌列表和系列列表
    async loadBrandsAndSeries() {
      try {
        this.setData({ loading: true });

        // 并行加载品牌和系列
        const [brandsRes, seriesRes] = await Promise.all([
          productApi.getAllBrands(),
          productApi.getAllSeriesList()
        ]);

        console.log('品牌数据:', brandsRes);
        console.log('系列数据:', seriesRes);

        if (brandsRes.code === 200 && seriesRes.code === 200) {
          // 处理品牌数据
          const brandObjects = brandsRes.data || [];
          const brands = brandObjects.map((item: any) => item.name || item);

          // 处理系列数据 - 处理logo路径
          const allSeries = (seriesRes.data || []).map((item: any) => ({
            id: item.id,
            brandId: item.brandId,
            brand: item.brand,
            brandName: item.brandName,
            name: item.series || item.name,
            logo: item.logo ? getFullImageUrl(item.logo) : ''
          }));

          console.log('处理后的系列数据:', allSeries);

          // 按品牌分组系列
          const brandSeriesList = brands.map((brand: string) => {
            const series = allSeries
              .filter((item: any) => item.brand === brand || item.brandName === brand)
              .map((item: any) => ({
                name: item.name,
                logo: item.logo
              }));
            return { brand, series };
          }).filter((item: any) => item.series.length > 0); // 只保留有系列的品牌

          console.log('品牌系列列表:', brandSeriesList);

          const availableBrands = brandSeriesList.map((item: any) => item.brand);
          this.setData({
            // 侧边栏只展示有系列内容的品牌，确保索引与锚点一一对应
            brands: availableBrands,
            brandSeriesList,
            currentBrand: availableBrands.length > 0 ? availableBrands[0] : '',
            loading: false
          });
        }
      } catch (error) {
        console.error('加载品牌系列列表失败:', error);
        this.setData({ loading: false });
      }
    },

    // 点击品牌导航
    onBrandTap(e: any) {
      const index = Number(e.currentTarget.dataset.index);
      const brand = this.data.brandSeriesList[index]?.brand || e.currentTarget.dataset.brand;

      // 使用视图层传入的索引，避免按品牌名查找导致的定位偏差
      if (!Number.isNaN(index) && index >= 0) {
        this.setData({
          currentBrand: brand,
          manualSelectBrand: brand,
          scrollIntoView: `brand-${index}`
        });

        // 清除 scrollIntoView，以便下次可以再次触发
        this.clearScrollIntoViewLater();

        // 给锚点滚动留出时间，再恢复滚动驱动的选中逻辑
        this.releaseManualSelectBrand(brand);
      }
    },

    // 系列项点击
    onSeriesItemTap(e: any) {
      const brand = e.currentTarget.dataset.brand;
      const series = e.currentTarget.dataset.series;
      wx.navigateTo({
        url: `/pages/series-detail/series-detail?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(series)}`
      });
    },

    // 点击品牌标题，跳转到系列介绍页
    onBrandTitleTap(e: any) {
      const brand = e.currentTarget.dataset.brand;
      wx.navigateTo({
        url: `/pages/series-detail/series-detail?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(brand)}`
      });
    },

    // 加载Hero图片
    async loadHeroImage() {
      try {
        const res: any = await homeApi.getHomeData();
        if (res.code === 200 && res.data) {
          this.setData({
            heroImage: getFullImageUrl(res.data.collectionHeroImage) || ''
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

    // 下拉刷新
    onPullDownRefresh() {
      this.loadBrandsAndSeries();
      setTimeout(() => {
        wx.stopPullDownRefresh();
      }, 1000);
    },

    // 点击搜索
    onSearchTap() {
      wx.navigateTo({
        url: '/pages/search/search'
      });
    },

    // 图片加载失败
    onImageError(e: any) {
      const seriesName = e.currentTarget.dataset.series;
      console.error('系列图片加载失败:', seriesName, e.detail);
    }
  }
});
