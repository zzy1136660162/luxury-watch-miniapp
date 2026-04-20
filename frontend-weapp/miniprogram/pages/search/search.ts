import { productApi } from '../../utils/request';
import { sortByPinyin } from '../../utils/pinyin';
import { getFullImageUrl } from '../../utils/config';

interface BrandItem {
  name: string;
  image?: string;
}

interface BrandGroup {
  letter: string;
  brands: BrandItem[];
}

interface HotBrand {
  name: string;
  image?: string;
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
    hotSeries: [] as { brand: string; series: string; logo?: string }[]
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
        const brands = res.data.slice(0, 20);
        this.processBrands(brands);
      }
    } catch (err) {
      console.error('加载品牌失败:', err);
    }
  },

  async processBrands(brands: string[]) {
    const hotBrandNames = brands.slice(0, 10);
    const sortedGroups = sortByPinyin(brands);

    // 为所有品牌加载图片
    const allBrandImages = await this.loadBrandImages(brands);
    const brandImageMap = new Map(allBrandImages.map(b => [b.name, b.image]));

    const brandGroups: BrandGroup[] = sortedGroups.map(group => ({
      letter: group.letter,
      brands: group.items.map(name => ({
        name,
        image: brandImageMap.get(name) || ''
      }))
    }));

    const letters = brandGroups.map(group => group.letter);

    // 获取热门品牌的图片
    const hotBrands: HotBrand[] = hotBrandNames.map(name => ({
      name,
      image: brandImageMap.get(name) || ''
    }));

    this.setData({
      hotBrands,
      brandGroups,
      letters
    });
  },

  // 加载品牌图片
  async loadBrandImages(brandNames: string[]): Promise<HotBrand[]> {
    const hotBrands: HotBrand[] = [];

    for (const name of brandNames) {
      try {
        // 查询该品牌的商品获取品牌图片
        const res: any = await productApi.getProductsByBrand(name);
        let image = '';
        if (res && res.code === 200 && res.data && res.data.list && res.data.list.length > 0) {
          // 找到有品牌图片的商品
          const productWithImage = res.data.list.find((p: any) => p.brandImage);
          if (productWithImage) {
            image = getFullImageUrl(productWithImage.brandImage);
          }
        }
        hotBrands.push({ name, image });
      } catch (err) {
        console.error(`加载品牌[${name}]图片失败:`, err);
        hotBrands.push({ name });
      }
    }

    return hotBrands;
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
        // 处理logo字段，添加完整URL
        const hotSeries = res.data.map((item: any) => {
          if (item.logo) {
            item.logo = getFullImageUrl(item.logo);
          }
          return item;
        });
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
    const letters = this.data.letters;
    
    if (letters.includes(letter)) {
      this.setData({
        currentLetter: letter,
        scrollIntoViewId: 'brand-' + letter
      });
      
      setTimeout(() => {
        this.setData({ scrollIntoViewId: '' });
      }, 500);
    } else {
      wx.showToast({
        title: '暂无该字母品牌',
        icon: 'none'
      });
    }
  },

  onScroll() {
  }
});
