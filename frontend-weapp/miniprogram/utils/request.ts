/**
 * 小程序请求工具类
 * 用于调用后端API
 */

const baseUrl = 'http://127.0.0.1:8081';

/**
 * 处理登录过期
 */
const handleUnauthorized = () => {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.redirectTo({
    url: '/pages/login/login'
  });
};

/**
 * 封装wx.request请求
 */
const request = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.header
    };
    if (token) {
      headers['Authorization'] = token;
    }

    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: headers,
      success: (res: any) => {
        // 检查登录过期
        if (res.statusCode === 401 || (res.data && res.data.code === 401)) {
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          });
          handleUnauthorized();
          reject(res);
          return;
        }
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err: any) => {
        reject(err);
      }
    });
  });
};

/**
 * 商品相关API
 */
export const productApi = {
  /**
   * 获取商品列表
   */
  getList: (params?: { page?: number; size?: number; category?: string }) => {
    return request({
      url: '/api/product/list',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取商品详情
   */
  getDetail: (id: number) => {
    return request({
      url: `/api/product/${id}`,
      method: 'GET'
    });
  },

  /**
   * 获取上架商品列表（小程序专用）
   */
  getOnlineList: (params?: {
    page?: number;
    size?: number;
    category?: string;
    brand?: string;
    price?: string;
    caseSize?: string;
    material?: string;
    strap?: string;
    waterResistance?: string;
    powerReserve?: string;
  }) => {
    return request({
      url: '/api/product/online/list',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取精选商品
   */
  getFeatured: (params?: { brand?: string }) => {
    return request({
      url: '/api/product/featured',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取所有品牌列表
   */
  getAllBrands: () => {
    return request({
      url: '/api/brands',
      method: 'GET'
    });
  },

  /**
   * 获取热门系列
   */
  getHotSeries: () => {
    return request({
      url: '/api/series/hot',
      method: 'GET'
    });
  },

  /**
   * 获取所有系列列表（去重）
   */
  getAllSeriesList: () => {
    return request({
      url: '/api/series/all',
      method: 'GET'
    });
  },

  /**
   * 根据品牌名称获取该品牌的所有系列
   */
  getSeriesByBrandName: (brand: string) => {
    return request({
      url: '/api/series/by-brand',
      method: 'GET',
      data: { brand }
    });
  },

  /**
   * 获取品牌下所有系列详情（带商品）
   */
  getBrandSeriesDetail: (brand: string) => {
    return request({
      url: '/api/series/brand-detail',
      method: 'GET',
      data: { brand }
    });
  },

  /**
   * 搜索商品
   */
  search: (params: { keyword: string }) => {
    return request({
      url: '/api/product/search',
      method: 'GET',
      data: params
    });
  },

  /**
   * 高级筛选商品
   */
  advancedFilter: (params: {
    brand?: string;
    series?: string;
    price?: string;
    caseSize?: string;
    material?: string;
    strap?: string;
    waterResistance?: string;
    powerReserve?: string;
  }) => {
    return request({
      url: '/api/product/filter',
      method: 'GET',
      data: params
    });
  },

  /**
   * 根据品牌获取商品列表
   */
  getProductsByBrand: (brand: string, params?: { page?: number; size?: number }) => {
    return request({
      url: '/api/product/online/list',
      method: 'GET',
      data: { brand, ...params }
    });
  }
};

/**
 * 首页相关API
 */
export const homeApi = {
  /**
   * 获取首页数据
   */
  getHomeData: () => {
    return request({
      url: '/api/home/data',
      method: 'GET'
    });
  },

  /**
   * 获取新品推荐
   */
  getNewArrivals: () => {
    return request({
      url: '/api/home/new-arrivals',
      method: 'GET'
    });
  },

  /**
   * 获取热门系列
   */
  getFeaturedCollections: () => {
    return request({
      url: '/api/home/featured-collections',
      method: 'GET'
    });
  }
};

/**
 * 系列相关API
 */
export const collectionApi = {
  /**
   * 获取所有系列
   */
  getAllCollections: () => {
    return request({
      url: '/api/collection/list',
      method: 'GET'
    });
  },

  /**
   * 获取指定系列下的商品
   */
  getByCollection: (collection: string, params?: { page?: number; size?: number }) => {
    return request({
      url: `/api/collection/${collection}`,
      method: 'GET',
      data: params
    });
  }
};

/**
 * 门店相关API
 */
export const storeApi = {
  /**
   * 获取门店列表
   */
  getList: () => {
    return request({
      url: '/api/appointment/stores',
      method: 'GET'
    });
  }
};

/**
 * 预约相关API
 */
export const appointmentApi = {
  /**
   * 创建预约
   */
  create: (data: { storeId: number; appointmentDate: string; appointmentTime: string; remark?: string }) => {
    return request({
      url: '/api/appointment',
      method: 'POST',
      data
    });
  },

  /**
   * 获取我的预约列表
   */
  getMyList: () => {
    return request({
      url: '/api/appointment/my',
      method: 'GET'
    });
  },

  /**
   * 取消预约
   */
  cancel: (id: number) => {
    return request({
      url: `/api/appointment/${id}/cancel`,
      method: 'PUT'
    });
  }
};

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取当前用户信息（包含积分）
   */
  getCurrentUser: () => {
    return request({
      url: '/api/user/current',
      method: 'GET'
    });
  },

  /**
   * 获取当前用户的兑换记录列表
   */
  getExchangeRecords: () => {
    return request({
      url: '/api/user/exchange-records',
      method: 'GET'
    });
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: (data: { address?: string }) => {
    return request({
      url: '/api/user/update',
      method: 'POST',
      data
    });
  }
};

/**
 * 积分兑换相关API
 */
export const rewardApi = {
  /**
   * 获取可积分兑换的商品列表
   */
  getRedeemableProducts: (params?: { page?: number; size?: number }) => {
    return request({
      url: '/api/product/redeemable',
      method: 'GET',
      data: params
    });
  },

  /**
   * 积分兑换商品
   */
  exchange: (data: { productId: number; phone?: string }) => {
    return request({
      url: '/api/exchange',
      method: 'POST',
      data
    });
  }
};

export default {
  request,
  productApi,
  homeApi,
  collectionApi,
  storeApi,
  appointmentApi,
  userApi,
  rewardApi
};
