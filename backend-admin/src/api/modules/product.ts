import api from '../index'
import type { Product } from '@/types'

export default {
  // ==================== 商品管理 ====================

  // 获取商品列表
  getProductList: (params: {
    page?: number
    size?: number
    name?: string
    category?: string
    status?: number
  }) => api.get('/product/list', { params }),

  // 获取商品详情
  getProductDetail: (id: number) => api.get(`/product/${id}`),

  // 创建商品
  createProduct: (data: Partial<Product>) => api.post('/product', data),

  // 更新商品
  updateProduct: (id: number, data: Partial<Product>) => api.put(`/product/${id}`, data),

  // 删除商品
  deleteProduct: (id: number) => api.delete(`/product/${id}`),

  // 批量删除商品
  batchDeleteProduct: (ids: number[]) => api.post('/product/batch-delete', { ids }),

  // 更新商品状态
  updateProductStatus: (id: number, status: number) => api.put(`/product/${id}/status`, { status }),

  // 更新商品库存
  updateProductStock: (id: number, stock: number) => api.put(`/product/${id}/stock`, { stock }),

  // ==================== 品牌管理 ====================

  // 获取品牌列表（分页）
  getBrandList: (params?: { page?: number; size?: number }) => api.get('/product/brand/list', { params }),

  // 获取品牌详情
  getBrandDetail: (id: number) => api.get(`/product/brand/${id}`),

  // 创建品牌
  createBrand: (data: { name: string; logo?: string }) => api.post('/product/brand', data),

  // 更新品牌
  updateBrand: (id: number, data: { name?: string; logo?: string }) => api.put(`/product/brand/${id}`, data),

  // 删除品牌
  deleteBrand: (id: number) => api.delete(`/product/brand/${id}`),

  // 获取品牌列表（用于Autocomplete）
  getBrandAutocomplete: (query?: string) => api.get('/product/brands', { params: { query } }),

  // ==================== 系列管理 ====================

  // 获取系列列表（分页）
  getSeriesList: (params?: { page?: number; size?: number }) => api.get('/product/series/list', { params }),

  // 获取系列详情
  getSeriesDetail: (id: number) => api.get(`/product/series/${id}`),

  // 创建系列
  createSeries: (data: { brandId: number; name: string; logo?: string }) => api.post('/product/series', data),

  // 更新系列
  updateSeries: (id: number, data: { brandId?: number; name?: string; logo?: string }) => api.put(`/product/series/${id}`, data),

  // 删除系列
  deleteSeries: (id: number) => api.delete(`/product/series/${id}`),

  // 获取系列列表（用于Autocomplete）
  getSeriesAutocomplete: (brand: string, query?: string) => api.get('/product/series', { params: { brand, query } }),

  // ==================== 商品分类管理 ====================

  // 获取商品分类列表
  getCategoryList: () => api.get('/product/category/list'),

  // 获取商品分类详情
  getCategoryDetail: (id: number) => api.get(`/product/category/${id}`),

  // 创建商品分类
  createCategory: (data: any) => api.post('/product/category', data),

  // 更新商品分类
  updateCategory: (id: number, data: any) => api.put(`/product/category/${id}`, data),

  // 删除商品分类
  deleteCategory: (id: number) => api.delete(`/product/category/${id}`),
}
