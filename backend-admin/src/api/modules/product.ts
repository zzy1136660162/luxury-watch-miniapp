import api from '../index'
import type { Product, PageResult, ApiResponse } from '@/types'

export default {
  // ==================== 商品管理 ====================
  
  // 获取商品列表
  getProductList: (params: {
    page?: number
    size?: number
    name?: string
    category?: string
    status?: number
  }) => api.get<ApiResponse<PageResult<Product>>>('/product/list', { params }),

  // 获取商品详情
  getProductDetail: (id: number) => api.get<ApiResponse<Product>>(`/product/${id}`),

  // 创建商品
  createProduct: (data: Partial<Product>) => api.post<ApiResponse<Product>>('/product', data),

  // 更新商品
  updateProduct: (id: number, data: Partial<Product>) => api.put<ApiResponse<Product>>(`/product/${id}`, data),

  // 删除商品
  deleteProduct: (id: number) => api.delete<ApiResponse<void>>(`/product/${id}`),

  // 批量删除商品
  batchDeleteProduct: (ids: number[]) => api.post<ApiResponse<void>>('/product/batch-delete', { ids }),

  // 更新商品状态
  updateProductStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/product/${id}/status`, { status }),

  // 更新商品库存
  updateProductStock: (id: number, stock: number) => api.put<ApiResponse<void>>(`/product/${id}/stock`, { stock }),

  // ==================== 品牌和系列 ====================

  // 获取所有品牌列表
  getBrands: () => api.get<ApiResponse<any[]>>('/product/brands'),

  // 根据品牌ID获取系列列表
  getSeriesByBrand: (brandId: number) => api.get<ApiResponse<any[]>>('/product/series', { params: { brandId } }),

  // 根据品牌和系列名查询已存在的系列Logo
  getSeriesLogo: (brand: string, series: string) => api.get<ApiResponse<string | null>>('/product/series-logo', {
    params: { brand, series }
  }),

  // 根据品牌名查询品牌信息（是否存在、品牌图片）
  getBrandInfo: (brand: string) => api.get<ApiResponse<{ exists: boolean; brandImage: string }>>('/product/brand-info', {
    params: { brand }
  }),
}
