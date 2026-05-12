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
  images?: string;
  video?: string;
  content?: string;
}

interface SeriesDetailData {
  brand: BrandInfo;
  bannerImages: string[];
  bannerMedias: string[];
  seriesList: SeriesItem[];
  currentSeriesIndex: number;
  isVideoPlaying: boolean;
  hasPlayedVideo: boolean;
}

Page({
  data: {
    brandName: '',
    brandInfo: null as BrandInfo | null,
    bannerImages: [] as string[],
    bannerMedias: [] as string[],
    bannerMediaList: [] as { url: string; isVideo: boolean }[],
    currentSeries: null as SeriesItem | null,
    otherSeries: [] as SeriesItem[],
    seriesList: [] as SeriesItem[],
    currentTab: 'watches',
    tabContentAnimation: {} as WechatMiniprogram.AnimationExportResult,
    isTabSwitching: false,
    loading: true,
    isVideoPlaying: false,
    hasPlayedVideo: false,
    isMuted: true,
    currentSeriesMuted: false,
    otherSeriesMuted: true
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
      console.log('res.code:', res.code);
      console.log('res.data:', res.data);

      if (res.code === 200 && res.data) {
        const data = res.data;
        console.log('brand:', data.brand);
        console.log('seriesList:', data.seriesList);

        // 品牌信息
        const brandInfo: BrandInfo = {
          id: data.brand.id,
          name: data.brand.name,
          logo: data.brand.logo ? getFullImageUrl(data.brand.logo) : '',
          images: data.brand.images || '',
          video: data.brand.video || '',
          content: this.processRichTextImages(data.brand.content || '')
        };
        console.log('brandInfo:', brandInfo);

        // 处理图片路径
        const bannerImages = (data.bannerImages || []).map((img: string) =>
          img ? getFullImageUrl(img) : ''
        );

        // 处理轮播图媒体（包含品牌视频和图片），将品牌视频放到第一位
        const brandVideo = data.brand.video ? getFullImageUrl(data.brand.video) : '';
        const allMedias = (data.bannerImages || []).map((img: string) =>
          img ? getFullImageUrl(img) : ''
        ).filter(Boolean);

        // 将品牌视频放到最前面，然后是轮播图中的视频，然后是图片
        const videoMedias = allMedias.filter((media: string) => this.isVideoFile(media));
        const imageMedias = allMedias.filter((media: string) => !this.isVideoFile(media));

        // 如果有品牌视频，将其放到第一位
        let bannerMedias: string[] = [];
        if (brandVideo) {
          bannerMedias = [brandVideo, ...videoMedias, ...imageMedias];
        } else {
          bannerMedias = [...videoMedias, ...imageMedias];
        }

        // 生成带isVideo标记的bannerMedias
        const bannerMediaList = bannerMedias.map((url: string) => ({
          url: url,
          isVideo: this.isVideoFile(url)
        }));

        console.log('bannerMedias:', bannerMedias);
        console.log('bannerMediaList:', bannerMediaList);

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
            videoUrl: s.videoUrl ? getFullImageUrl(s.videoUrl) : '',
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
          bannerMedias,
          bannerMediaList,
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
    const { currentTab, isTabSwitching } = this.data;

    if (!tab || tab === currentTab || isTabSwitching) {
      return;
    }

    const outAnimation = wx.createAnimation({
      duration: 160,
      timingFunction: 'ease-out'
    });
    outAnimation.opacity(0).translateY(10).step();

    this.setData({
      isTabSwitching: true,
      tabContentAnimation: outAnimation.export()
    });

    setTimeout(() => {
      const inAnimation = wx.createAnimation({
        duration: 220,
        timingFunction: 'ease-out'
      });
      inAnimation.opacity(1).translateY(0).step();

      this.setData({
        currentTab: tab,
        tabContentAnimation: inAnimation.export(),
        isTabSwitching: false
      });
    }, 170);
  },

  onProductTap(e: any) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  },

  isVideoFile(media: string): boolean {
    if (!media) return false;
    const ext = media.toLowerCase().split('.').pop();
    return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext || '');
  },

  onSwiperChange(e: any) {
    const current = e.detail.current;
    const { bannerMediaList } = this.data;

    if (bannerMediaList && bannerMediaList[current]) {
      const currentMedia = bannerMediaList[current];
      this.setData({
        isVideoPlaying: currentMedia.isVideo
      });

      if (currentMedia.isVideo) {
        this.setData({
          hasPlayedVideo: true
        });
      }
    }
  },

  onVideoPlay() {
    this.setData({
      isVideoPlaying: true
    });
  },

  onVideoPause() {
    this.setData({
      isVideoPlaying: false
    });
  },

  onVideoEnded() {
    this.setData({
      isVideoPlaying: false
    });
  },

  // 切换轮播图视频的音量
  toggleBannerMute() {
    this.setData({
      isMuted: !this.data.isMuted
    });
    console.log('轮播图视频静音状态:', this.data.isMuted);
  },

  // 切换系列视频的音量
  toggleSeriesMute() {
    this.setData({
      currentSeriesMuted: !this.data.currentSeriesMuted
    });
    console.log('系列视频静音状态:', this.data.currentSeriesMuted);
  },

  // 切换其他系列视频的音量
  toggleOtherSeriesMute() {
    this.setData({
      otherSeriesMuted: !this.data.otherSeriesMuted
    });
    console.log('其他系列视频静音状态:', this.data.otherSeriesMuted);
  },

  // 处理富文本中的图片路径，拼接完整URL并添加样式
  processRichTextImages(htmlContent: string): string {
    if (!htmlContent) return '';

    const baseUrl = 'http://localhost:8081';

    // 替换 img 标签中的 src 属性，并添加样式限制
    let processedContent = htmlContent.replace(
      /<img([^>]*)src=["']([^"']+)["']([^>]*)>/g,
      (match, before, src, after) => {
        let fullUrl = src;

        // 如果是相对路径，拼接完整URL
        if (!src.startsWith('http://') && !src.startsWith('https://')) {
          fullUrl = baseUrl + src;
        }

        // 返回带有样式的 img 标签
        return `<img${before}src="${fullUrl}"${after} style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
      }
    );

    return processedContent;
  }
});
