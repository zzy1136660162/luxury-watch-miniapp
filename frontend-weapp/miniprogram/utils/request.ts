/**
 * 小程序请求工具类
 * 用于调用后端API
 */

import { apiConfig } from './api-config';

const baseUrl = apiConfig.baseUrl;

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
 * 首页相关API
 */
export const homeApi = {
  getHomeData: () => {
    return request({
      url: '/api/home/data',
      method: 'GET'
    });
  },

  getNewArrivals: () => {
    return request({
      url: '/api/home/new-arrivals',
      method: 'GET'
    });
  },

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
  getAllCollections: () => {
    return request({
      url: '/api/series/all',
      method: 'GET'
    });
  }
};

/**
 * 商品相关API
 */
export const productApi = {
  getList: (params?: { page?: number; size?: number; category?: string }) => {
    return request({
      url: '/api/product/online/list',
      method: 'GET',
      data: params
    });
  },

  getDetail: (id: number) => {
    return request({
      url: `/api/product/${id}`,
      method: 'GET'
    });
  },

  getAllBrands: () => {
    return request({
      url: '/api/brands',
      method: 'GET'
    });
  },

  getAllSeriesList: () => {
    return request({
      url: '/api/series/all',
      method: 'GET'
    });
  },

  getSeriesByBrand: (brand: string) => {
    return request({
      url: `/api/series/by-brand?brand=${encodeURIComponent(brand)}`,
      method: 'GET'
    });
  },

  getHotSeries: () => {
    return request({
      url: '/api/series/hot',
      method: 'GET'
    });
  },

  getFeatured: () => {
    return request({
      url: '/api/product/featured',
      method: 'GET'
    });
  },

  getBrandSeriesDetail: (brand: string) => {
    return request({
      url: `/api/series/brand-detail?brand=${encodeURIComponent(brand)}`,
      method: 'GET'
    });
  },

  search: (params: { keyword?: string; brand?: string; series?: string; category?: string; price?: string }) => {
    return request({
      url: '/api/product/search',
      method: 'GET',
      data: params
    });
  },

  filter: (params: { brand?: string; series?: string; category?: string; price?: string; caseSize?: string; material?: string }) => {
    return request({
      url: '/api/product/filter',
      method: 'GET',
      data: params
    });
  }
};

/**
 * 品牌相关API
 */
export const brandApi = {
  getBrandDetail: (brand: string) => {
    return request({
      url: `/api/series/brand-detail?brand=${encodeURIComponent(brand)}`,
      method: 'GET'
    });
  }
};

/**
 * 用户相关API
 */
export const userApi = {
  getCurrentUser: () => {
    return request({
      url: '/api/user/current',
      method: 'GET'
    });
  },

  updateUser: (data: any) => {
    return request({
      url: '/api/user/update',
      method: 'POST',
      data: data
    });
  },

  getExchangeRecords: () => {
    return request({
      url: '/api/user/exchange-records',
      method: 'GET'
    });
  }
};

/**
 * 预约相关API
 */
export const appointmentApi = {
  getStores: () => {
    return request({
      url: '/api/appointment/stores',
      method: 'GET'
    });
  },

  create: (data: any) => {
    return request({
      url: '/api/appointment',
      method: 'POST',
      data: data
    });
  },

  getMyList: () => {
    return request({
      url: '/api/appointment/my',
      method: 'GET'
    });
  },

  cancel: (id: number) => {
    return request({
      url: `/api/appointment/${id}/cancel`,
      method: 'PUT'
    });
  }
};

/**
 * 门店相关API
 */
export const storeApi = {
  getList: () => {
    return request({
      url: '/api/appointment/stores',
      method: 'GET'
    });
  }
};

/**
 * 积分礼品相关API
 */
export const rewardApi = {
  getRedeemableProducts: () => {
    return request({
      url: '/api/product/redeemable',
      method: 'GET'
    });
  },

  exchange: (data: { productId: number; phone: string; address: string }) => {
    return request({
      url: '/api/exchange',
      method: 'POST',
      data: data
    });
  }
};

/**
 * 登录相关API
 */
export const loginApi = {
  login: (data: { phone: string; password: string; username?: string; avatar?: string; wechatAvatar?: string }) => {
    return request({
      url: '/api/mini/login',
      method: 'POST',
      data: data
    });
  },

  getUserInfo: () => {
    return request({
      url: '/api/mini/userinfo',
      method: 'GET'
    });
  },

  logout: () => {
    return request({
      url: '/api/mini/logout',
      method: 'POST'
    });
  }
};

/**
 * 微信用户相关API
 */
export const wxUserApi = {
  update: (id: number, data: any) => {
    return request({
      url: `/wx-user/${id}`,
      method: 'PUT',
      data: data
    });
  },

  getByPhone: (phone: string) => {
    return request({
      url: `/wx-user/by-phone?phone=${phone}`,
      method: 'GET'
    });
  }
};

export default {
  request,
  homeApi,
  collectionApi,
  productApi,
  brandApi,
  userApi,
  appointmentApi,
  rewardApi,
  loginApi,
  wxUserApi,
  storeApi
};
