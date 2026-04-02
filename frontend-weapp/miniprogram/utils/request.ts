/**
 * 小程序请求工具类
 * 用于调用后端API
 */

const baseUrl = 'http://192.168.177.1:8081';

/**
 * 封装wx.request请求
 */
const request = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
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

export default {
  request,
  productApi,
  homeApi,
  collectionApi
};
