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
  }) => api.get<PageResult<Product>>('/product/list', { params }),

  // 获取商品详情
  getProductDetail: (id: number) => api.get<Product>(`/product/${id}`),

  // 创建商品
  createProduct: (data: Partial<Product>) => api.post<Product>('/product', data),

  // 更新商品
  updateProduct: (id: number, data: Partial<Product>) => api.put<Product>(`/product/${id}`, data),

  // 删除商品
  deleteProduct: (id: number) => api.delete<void>(`/product/${id}`),

  // 批量删除商品
  batchDeleteProduct: (ids: number[]) => api.post<void>('/product/batch-delete', { ids }),

  // 更新商品状态
  updateProductStatus: (id: number, status: number) => api.put<void>(`/product/${id}/status`, { status }),

  // 更新商品库存
  updateProductStock: (id: number, stock: number) => api.put<void>(`/product/${id}/stock`, { stock }),
}
