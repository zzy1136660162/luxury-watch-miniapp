import { getFullImageUrl } from '../../utils/config';
import { productApi } from '../../utils/request';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface SeriesItem {
  id: number;
  name: string;
  logo: string;
  image: string;
  videoUrl?: string;
  content?: string;
  products: Product[];
}

interface BrandInfo {
  id: number;
  name: string;
  logo?: string;
  content?: string;
}

interface SeriesDetailData {
  brand: BrandInfo;
  bannerImages: string[];
  seriesList: SeriesItem[];
  currentSeriesIndex: number;
}

Page({
  data: {
    brandName: '',
    brandInfo: null as BrandInfo | null,
    bannerImages: [] as string[],
    currentSeries: null as SeriesItem | null,
    otherSeries: [] as SeriesItem[],
    seriesList: [] as SeriesItem[],
    currentTab: 'watches',
    loading: true
  },

  onLoad(options: any) {
    const brand = decodeURIComponent(options.brand || '');
    const series = decodeURIComponent(options.series || '');
    console.log('系列详情页加载:', brand, series);

    if (brand && series) {
      this.loadSeriesDetail(brand, series);
      this.setData({ brandName: brand });
    }
  },

  async loadSeriesDetail(brand: string, currentSeriesName: string) {
    try {
      this.setData({ loading: true });

      const res: any = await productApi.getBrandSeriesDetail(brand);
      console.log('系列详情数据:', res);

      if (res.code === 200 && res.data) {
        const data = res.data;
        console.log('seriesList:', data.seriesList);

        // 品牌信息
        const brandInfo: BrandInfo = {
          id: data.brand.id,
          name: data.brand.name,
          logo: data.brand.logo ? getFullImageUrl(data.brand.logo) : '',
          content: data.brand.content || ''
        };

        // 处理图片路径
        const bannerImages = (data.bannerImages || []).map((img: string) =>
          img ? getFullImageUrl(img) : ''
        );

        // 找到当前点击的系列索引
        const currentIndex = data.seriesList.findIndex(
          (s: any) => s.name === currentSeriesName
        );
        console.log('当前系列索引:', currentIndex, '查找名称:', currentSeriesName);

        // 当前系列（带完整图片路径）
        let currentSeries = null;
        if (currentIndex !== -1) {
          const seriesData = data.seriesList[currentIndex];
          currentSeries = {
            id: seriesData.id,
            name: seriesData.name,
            logo: seriesData.logo ? getFullImageUrl(seriesData.logo) : '',
            videoUrl: seriesData.videoUrl ? getFullImageUrl(seriesData.videoUrl) : '',
            content: seriesData.content || '',
            products: (seriesData.products || []).map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.image ? getFullImageUrl(p.image) : '',
              price: p.price
            }))
          };
        }

        // 其他系列
        const otherSeries = data.seriesList
          .filter((_: any, index: number) => index !== currentIndex)
          .map((s: any) => ({
            id: s.id,
            name: s.name,
            logo: s.logo ? getFullImageUrl(s.logo) : '',
            content: s.content || '',
            products: (s.products || []).slice(0, 3).map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.image ? getFullImageUrl(p.image) : '',
              price: p.price
            }))
          }));

        // 所有系列（用于首页Tab展示富文本）
        const seriesList = data.seriesList.map((s: any) => ({
          id: s.id,
          name: s.name,
          logo: s.logo ? getFullImageUrl(s.logo) : '',
          content: s.content || '',
          products: (s.products || []).slice(0, 3).map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image ? getFullImageUrl(p.image) : '',
            price: p.price
          }))
        }));

        console.log('处理后的brandInfo:', brandInfo);
        console.log('处理后的currentSeries:', currentSeries);
        console.log('处理后的otherSeries:', otherSeries);
        console.log('处理后的seriesList:', seriesList);

        this.setData({
          brandInfo,
          bannerImages,
          currentSeries,
          otherSeries,
          seriesList,
          loading: false
        });
      }
    } catch (error) {
      console.error('加载系列详情失败:', error);
      this.setData({ loading: false });
    }
  },

  onTabClick(e: any) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  onProductTap(e: any) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  }
});
