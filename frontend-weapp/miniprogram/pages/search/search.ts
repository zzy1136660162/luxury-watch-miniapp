import { productApi } from '../../utils/request';
import { sortByPinyin } from '../../utils/pinyin';
import { getFullImageUrl } from '../../utils/config';

interface BrandItem {
  id: number;
  name: string;
  logo?: string;
}

interface BrandGroup {
  letter: string;
  brands: BrandItem[];
}

interface HotBrand {
  id: number;
  name: string;
  logo?: string;
}

interface HotSeriesItem {
  id: number;
  brandId: number;
  name: string;
  logo?: string;
  brandName?: string;
}

const ALL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

Page({
  data: {
    hotBrands: [] as HotBrand[],
    brandGroups: [] as BrandGroup[],
    letters: [] as string[],
    allLetters: ALL_LETTERS,
    currentLetter: '',
    scrollIntoViewId: '',
    searchKey: '',
    hotSeries: [] as HotSeriesItem[]
  },

  onLoad() {
    this.loadBrands();
    this.loadHotSeries();
  },

  onBack() {
    wx.navigateBack();
  },

  async loadBrands() {
    try {
      const res: any = await productApi.getAllBrands();
      if (res && res.code === 200 && res.data) {
        // 后端返回的是 Brand 对象数组，包含 id, name, logo
        const brands: BrandItem[] = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          logo: item.logo ? getFullImageUrl(item.logo) : ''
        }));
        this.processBrands(brands);
      }
    } catch (err) {
      console.error('加载品牌失败:', err);
    }
  },

  async processBrands(brands: BrandItem[]) {
    // 取前10个作为热门品牌
    const hotBrands = brands.slice(0, 10);

    // 按品牌名称拼音分组
    const brandNames = brands.map(b => b.name);
    const sortedGroups = sortByPinyin(brandNames);

    // 创建品牌名称到品牌对象的映射
    const brandMap = new Map(brands.map(b => [b.name, b]));

    const brandGroups: BrandGroup[] = sortedGroups.map(group => ({
      letter: group.letter,
      brands: group.items.map(name => {
        const brand = brandMap.get(name);
        return {
          id: brand?.id || 0,
          name,
          logo: brand?.logo || ''
        };
      })
    }));

    const letters = brandGroups.map(group => group.letter);

    this.setData({
      hotBrands,
      brandGroups,
      letters
    });
  },

  onSearchInput(e: any) {
    this.setData({
      searchKey: e.detail.value
    });
  },

  onSearchConfirm(e: any) {
    const searchKey = e.detail.value.trim();
    if (searchKey) {
      this.navigateToSearchResult(searchKey);
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  },

  onSearchIconTap() {
    const searchKey = this.data.searchKey.trim();
    if (searchKey) {
      this.navigateToSearchResult(searchKey);
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  },

  navigateToSearchResult(keyword: string) {
    // 检查是否包含 "-" ，如果是则解析为品牌-系列
    if (keyword.includes('-')) {
      const parts = keyword.split('-');
      const brand = parts[0].trim();
      const series = parts.slice(1).join('-').trim();

      if (brand && series) {
        wx.navigateTo({
          url: `/pages/search-result/search-result?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(series)}`
        });
        return;
      }
    }

    // 否则作为普通关键词搜索
    wx.navigateTo({
      url: `/pages/search-result/search-result?keyword=${encodeURIComponent(keyword)}`
    });
  },

  onBrandTap(e: any) {
    const brand = e.currentTarget.dataset.brand;
    wx.navigateTo({
      url: `/pages/search-result/search-result?brand=${encodeURIComponent(brand)}`
    });
  },

  async loadHotSeries() {
    try {
      const res: any = await productApi.getHotSeries();
      if (res && res.code === 200 && res.data) {
        // 新接口返回的是 Series 对象数组
        const hotSeries: HotSeriesItem[] = res.data.map((item: any) => ({
          id: item.id,
          brandId: item.brandId,
          name: item.name,
          logo: item.logo ? getFullImageUrl(item.logo) : '',
          brandName: item.brandName || item.brand || ''
        }));
        this.setData({
          hotSeries: hotSeries
        });
      }
    } catch (err) {
      console.error('加载热门系列失败:', err);
    }
  },

  onSeriesTap(e: any) {
    const brand = e.currentTarget.dataset.brand;
    const series = e.currentTarget.dataset.series;
    wx.navigateTo({
      url: `/pages/search-result/search-result?brand=${encodeURIComponent(brand)}&series=${encodeURIComponent(series)}`
    });
  },

  onLetterTap(e: any) {
    const letter = e.currentTarget.dataset.letter;
    this.setData({
      currentLetter: letter,
      scrollIntoViewId: `brand-${letter}`
    });
  },

  onScroll(e: any) {
    // 可以在这里实现滚动时更新当前字母的逻辑
  }
});
