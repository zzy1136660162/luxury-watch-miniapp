import api from '../index'
import type { ApiResponse } from '@/types'

export default {
  // ==================== 积分兑换记录管理 ====================

  // 获取兑换记录列表
  getExchangeList: (params: {
    page?: number
    size?: number
    productName?: string
    userId?: number
    phone?: string
    status?: number
  }) => api.get<{ list: any[], total: number, page: number, size: number }>('/order/list', { params }),

  // 获取兑换记录详情
  getExchangeDetail: (id: number) => api.get<any>(`/order/${id}`),

  // 更新兑换状态
  updateExchangeStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/order/${id}/status`, { status }),

  // 批量更新兑换状态
  batchUpdateExchangeStatus: (ids: number[], status: number) => api.put<ApiResponse<void>>('/order/batch-status', { ids, status }),

  // 删除兑换记录
  deleteExchange: (id: number) => api.delete<ApiResponse<void>>(`/order/${id}`),

  // 批量删除兑换记录
  batchDeleteExchange: (ids: number[]) => api.post<ApiResponse<void>>('/order/batch-delete', { ids }),

  // ==================== 积分兑换商品管理 ====================

  // 获取兑换商品列表
  getExchangeProductList: (params: {
    page?: number
    size?: number
    name?: string
    status?: number
  }) => api.get<{ list: any[], total: number, page: number, size: number }>('/exchange/product/list', { params }),

  // 获取兑换商品详情
  getExchangeProductDetail: (id: number) => api.get<any>(`/exchange/product/${id}`),

  // 创建兑换商品
  createExchangeProduct: (data: {
    name: string
    code?: string
    image?: string
    pointsCost: number
    stock?: number
    description?: string
    status?: number
  }) => api.post<ApiResponse<void>>('/exchange/product', data),

  // 更新兑换商品
  updateExchangeProduct: (id: number, data: {
    name?: string
    code?: string
    image?: string
    pointsCost?: number
    stock?: number
    description?: string
    status?: number
  }) => api.put<ApiResponse<void>>(`/exchange/product/${id}`, data),

  // 删除兑换商品
  deleteExchangeProduct: (id: number) => api.delete<ApiResponse<void>>(`/exchange/product/${id}`),

  // 批量删除兑换商品
  batchDeleteExchangeProduct: (ids: number[]) => api.post<ApiResponse<void>>('/exchange/product/batch-delete', { ids }),
}
