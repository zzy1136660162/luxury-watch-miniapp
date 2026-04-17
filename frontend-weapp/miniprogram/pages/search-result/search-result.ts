import { productApi } from '../../utils/request';
import { getFullImageUrl } from '../../utils/config';

interface Product {
  id: number;
  name: string;
  code: string;
  brand: string;
  image: string;
  images: string;
  price: number;
  productImage: string;
}

Page({
  data: {
    brand: '',
    series: '',
    keyword: '',
    activeFilters: [] as string[],
    products: [] as Product[],
    loading: false,
    showFilter: false,
    filterCount: 0,
    brandSeries: [] as string[],
    filters: {
      category: '',
      series: '',
      price: '',
      caseSize: '',
      material: '',
      strap: '',
      waterResistance: '',
      powerReserve: ''
    }
  },

  onLoad(options: any) {
    const brand = decodeURIComponent(options.brand || '');
    const series = decodeURIComponent(options.series || '');
    const keyword = decodeURIComponent(options.keyword || '');
    const params: any = { };

    if (options.category) params.category = decodeURIComponent(options.category);
    if (options.price) params.price = decodeURIComponent(options.price);
    if (options.caseSize) params.caseSize = decodeURIComponent(options.caseSize);
    if (options.material) params.material = decodeURIComponent(options.material);
    if (options.strap) params.strap = decodeURIComponent(options.strap);
    if (options.waterResistance) params.waterResistance = decodeURIComponent(options.waterResistance);
    if (options.powerReserve) params.powerReserve = decodeURIComponent(options.powerReserve);

    const activeFilters = this.buildFilterLabels(params);

    this.setData({
      brand,
      series,
      keyword,
      activeFilters,
      filters: {
        category: options.category ? decodeURIComponent(options.category) : '',
        series: options.series ? decodeURIComponent(options.series) : '',
        price: options.price ? decodeURIComponent(options.price) : '',
        caseSize: options.caseSize ? decodeURIComponent(options.caseSize) : '',
        material: options.material ? decodeURIComponent(options.material) : '',
        strap: options.strap ? decodeURIComponent(options.strap) : '',
        waterResistance: options.waterResistance ? decodeURIComponent(options.waterResistance) : '',
        powerReserve: options.powerReserve ? decodeURIComponent(options.powerReserve) : ''
      }
    });

    this.updateFilterCount();

    // 如果有品牌，加载该品牌的系列列表
    if (brand) {
      this.loadBrandSeries(brand);
    }

    if (keyword) {
      this.loadSearchResults(keyword, params);
    } else {
      this.loadProducts(brand, series, params);
    }
  },

  async loadBrandSeries(brand: string) {
    try {
      const res: any = await productApi.getSeriesByBrandName(brand);
      if (res && res.code === 200 && res.data) {
        this.setData({
          brandSeries: res.data
        });
      }
    } catch (err) {
      console.error('加载品牌系列失败:', err);
    }
  },

  onSeriesSelect(e: any) {
    const series = e.currentTarget.dataset.value;
    this.setData({
      filters: {
        ...this.data.filters,
        series: series
      }
    });
  },

  buildFilterLabels(params: any): { type: string; value: string; label: string }[] {
    const labels: { type: string; value: string; label: string }[] = [];
    
    const valueMap: { [key: string]: { [value: string]: string } } = {
      category: {
        'classic': '经典',
        'sport': '运动',
        'complex': '复杂功能',
        'ladies': '女士'
      },
      price: {
        '0-5000': '5千以下',
        '5000-10000': '5千-1万',
        '10000-20000': '1万-2万',
        '20000-50000': '2万-5万',
        '50000-150000': '5万-15万',
        '150000-300000': '15万-30万',
        '300000-1000000': '30万-100万',
        '1000000+': '100万以上'
      },
      caseSize: {
        '0-36': '36mm以下',
        '36-39': '36-39mm',
        '39-42': '39-42mm',
        '42-45': '42-45mm',
        '45+': '45mm以上'
      },
      material: {
        'steel': '精钢',
        'gold': '18K金',
        'rose_gold': '玫瑰金',
        'titanium': '钛金属',
        'ceramic': '陶瓷'
      },
      strap: {
        'leather': '真皮',
        'steel': '钢带',
        'rubber': '橡胶',
        'fabric': '织物'
      },
      waterResistance: {
        '0': '不防水',
        '0-100': '100m以下',
        '100-300': '100-300m',
        '300-1000': '300-1000m',
        '1000-3000': '1000-3000m',
        '3000+': '3000m以上'
      },
      powerReserve: {
        '0-40': '40小时以下',
        '40-80': '40-80小时',
        '80-120': '80-120小时',
        '120+': '120小时以上'
      }
    };

    Object.keys(params).forEach(key => {
      if (params[key]) {
        const value = params[key];
        const label = valueMap[key]?.[value] || value;
        labels.push({ type: key, value, label });
      }
    });

    return labels;
  },

  async loadProducts(brand: string, series: string, params: any) {
    this.setData({ loading: true });

    try {
      const queryParams: any = {};
      
      // 品牌筛选（必须有）
      if (brand) {
        queryParams.brand = brand;
      }
      
      // 合并所有筛选参数
      if (params.category) queryParams.category = params.category;
      if (params.price) queryParams.price = params.price;
      if (params.caseSize) queryParams.caseSize = params.caseSize;
      if (params.material) queryParams.material = params.material;
      if (params.strap) queryParams.strap = params.strap;
      if (params.waterResistance) queryParams.waterResistance = params.waterResistance;
      if (params.powerReserve) queryParams.powerReserve = params.powerReserve;
      
      console.log('查询参数:', queryParams);
      
      // 使用 getOnlineList API（已验证可以正常工作）
      const res: any = await productApi.getOnlineList(queryParams);
      console.log('查询结果:', res);

      if (res && res.code === 200) {
        let products = res.data.list || [];
        
        // 如果有系列筛选，在前端过滤
        if (series) {
          products = products.filter((item: any) => item.series === series);
        }
        
        // 处理图片
        products = products.map((item: any) => {
          let productImage = '';
          if (item.images) {
            productImage = getFullImageUrl(item.images.split(',')[0]);
          } else if (item.image) {
            productImage = getFullImageUrl(item.image);
          }
          return {
            ...item,
            productImage
          };
        });

        this.setData({
          products,
          loading: false
        });
      } else {
        this.setData({ products: [], loading: false });
      }
    } catch (err) {
      console.error('加载商品失败:', err);
      this.setData({ products: [], loading: false });
    }
  },

  async loadSearchResults(keyword: string, params: any) {
    this.setData({ loading: true });

    try {
      const res: any = await productApi.search({ keyword });

      if (res && res.code === 200) {
        let products = (res.data || []).map((item: any) => {
          let productImage = '';
          if (item.images) {
            productImage = getFullImageUrl(item.images.split(',')[0]);
          } else if (item.image) {
            productImage = getFullImageUrl(item.image);
          }
          return {
            ...item,
            productImage
          };
        });

        if (Object.keys(params).length > 0) {
          products = this.applyFiltersLocally(products, params);
        }

        this.setData({
          products,
          loading: false
        });
      } else {
        this.setData({ products: [], loading: false });
      }
    } catch (err) {
      console.error('搜索商品失败:', err);
      this.setData({ products: [], loading: false });
    }
  },

  applyFiltersLocally(products: any[], params: any): any[] {
    return products.filter(product => {
      if (params.category && product.category !== params.category) {
        return false;
      }
      if (params.price) {
        const price = product.price;
        const [min, max] = this.parsePriceRange(params.price);
        if (price < min || (max && price > max)) {
          return false;
        }
      }
      return true;
    });
  },

  parsePriceRange(priceStr: string): [number, number | null] {
    if (priceStr.endsWith('+')) {
      const min = parseInt(priceStr);
      return [min, null];
    }
    const [min, max] = priceStr.split('-').map(Number);
    return [min, max];
  },

  onBack() {
    wx.navigateBack();
  },

  onProductTap(e: any) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${productId}`
    });
  },

  onOpenFilter() {
    this.setData({ showFilter: true });
  },

  onCloseFilter() {
    this.setData({ showFilter: false });
  },

  onFilterSelect(e: any) {
    const type = e.currentTarget.dataset.type;
    const value = e.currentTarget.dataset.value;
    const filters = this.data.filters;
    
    filters[type as keyof typeof filters] = filters[type as keyof typeof filters] === value ? '' : value;
    
    this.setData({ filters: { ...filters } });
    this.updateFilterCount();
  },

  updateFilterCount() {
    const filters = this.data.filters;
    let count = 0;
    if (filters.category) count++;
    if (filters.series) count++;
    if (filters.price) count++;
    if (filters.caseSize) count++;
    if (filters.material) count++;
    if (filters.strap) count++;
    if (filters.waterResistance) count++;
    if (filters.powerReserve) count++;
    this.setData({ filterCount: count });
  },

  onResetFilter() {
    this.setData({
      filters: { category: '', series: '', price: '', caseSize: '', material: '', strap: '', waterResistance: '', powerReserve: '' },
      filterCount: 0,
      activeFilters: [],
      series: '',  // 清空系列筛选
      showFilter: false
    });
    
    if (this.data.keyword) {
      this.loadSearchResults(this.data.keyword, {});
    } else {
      this.loadProducts(this.data.brand, '', {});
    }
  },

  onConfirmFilter() {
    const filters = this.data.filters;
    const params: any = {};
    if (filters.category) params.category = filters.category;
    if (filters.series) params.series = filters.series;
    if (filters.price) params.price = filters.price;
    if (filters.caseSize) params.caseSize = filters.caseSize;
    if (filters.material) params.material = filters.material;
    if (filters.strap) params.strap = filters.strap;
    if (filters.waterResistance) params.waterResistance = filters.waterResistance;
    if (filters.powerReserve) params.powerReserve = filters.powerReserve;

    const queryString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
    
    let url = '/pages/search-result/search-result?';
    if (this.data.keyword) {
      url += `keyword=${encodeURIComponent(this.data.keyword)}&`;
    }
    if (this.data.brand) {
      url += `brand=${encodeURIComponent(this.data.brand)}&`;
    }
    url += queryString;
    
    wx.redirectTo({ url: url.endsWith('&') ? url.slice(0, -1) : url });
  }
});
