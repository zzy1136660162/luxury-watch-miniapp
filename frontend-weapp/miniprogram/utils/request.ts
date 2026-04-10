/**
 * 小程序请求工具类
 * 用于调用后端API
 */

const baseUrl = 'http://127.0.0.1:8081';

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
  getOnlineList: (params?: { page?: number; size?: number; category?: string }) => {
    return request({
      url: '/api/product/online/list',
      method: 'GET',
      data: params
    });
  },

  /**
   * 获取精选商品
   */
  getFeatured: () => {
    return request({
      url: '/api/product/featured',
      method: 'GET'
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

export default {
  request,
  productApi,
  homeApi,
  collectionApi,
  storeApi,
  appointmentApi
};
