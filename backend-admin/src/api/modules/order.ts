import api from '../index'
import type { ExchangeRecord, PageResult, ApiResponse } from '@/types'

export default {
  // ==================== 兑换记录管理 ====================

  // 获取兑换记录列表
  getOrderList: (params: {
    page?: number
    size?: number
    productName?: string
    userId?: number
    phone?: string
    status?: number
  }) => api.get<{ list: ExchangeRecord[], total: number, page: number, size: number }>('/order/list', { params }),

  // 获取兑换记录详情
  getOrderDetail: (id: number) => api.get<ExchangeRecord>(`/order/${id}`),

  // 更新兑换状态
  updateOrderStatus: (id: number, status: number) => api.put<void>(`/order/${id}/status`, { status }),

  // 批量更新兑换状态
  batchUpdateOrderStatus: (ids: number[], status: number) => api.put<void>('/order/batch-status', { ids, status }),

  // 删除兑换记录
  deleteOrder: (id: number) => api.delete<void>(`/order/${id}`),

  // 批量删除兑换记录
  batchDeleteOrder: (ids: number[]) => api.post<void>('/order/batch-delete', { ids }),
}
