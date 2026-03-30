import api from '../index'
import type { Watch, WatchSeries, PageResult, ApiResponse } from '@/types'

export default {
  // ==================== 腕表管理 ====================
  
  // 获取腕表列表
  getWatchList: (params: {
    page?: number
    size?: number
    keyword?: string
    seriesId?: number
    isHot?: boolean
    isNew?: boolean
    isRecommend?: boolean
    status?: number
  }) => api.get<ApiResponse<PageResult<Watch>>>('/watch/list', { params }),

  // 获取腕表详情
  getWatchDetail: (id: number) => api.get<ApiResponse<Watch>>(`/watch/${id}`),

  // 创建腕表
  createWatch: (data: Partial<Watch>) => api.post<ApiResponse<Watch>>('/watch', data),

  // 更新腕表
  updateWatch: (id: number, data: Partial<Watch>) => api.put<ApiResponse<Watch>>(`/watch/${id}`, data),

  // 删除腕表
  deleteWatch: (id: number) => api.delete<ApiResponse<void>>(`/watch/${id}`),

  // 批量删除
  batchDeleteWatch: (ids: number[]) => api.post<ApiResponse<void>>('/watch/batch-delete', { ids }),

  // 更新腕表状态
  updateWatchStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/watch/${id}/status`, { status }),

  // 设置热门
  setHot: (id: number, isHot: boolean) => api.put<ApiResponse<void>>(`/watch/${id}/hot`, { isHot }),

  // 设置新品
  setNew: (id: number, isNew: boolean) => api.put<ApiResponse<void>>(`/watch/${id}/new`, { isNew }),

  // 设置推荐
  setRecommend: (id: number, isRecommend: boolean) => api.put<ApiResponse<void>>(`/watch/${id}/recommend`, { isRecommend }),

  // ==================== 腕表系列管理 ====================
  
  // 获取系列列表
  getSeriesList: (params?: { keyword?: string; status?: number }) => 
    api.get<ApiResponse<PageResult<WatchSeries>>>('/watch-series/list', { params }),

  // 获取所有系列（用于下拉选择）
  getAllSeries: () => api.get<ApiResponse<WatchSeries[]>>('/watch-series/all'),

  // 获取系列详情
  getSeriesDetail: (id: number) => api.get<ApiResponse<WatchSeries>>(`/watch-series/${id}`),

  // 创建系列
  createSeries: (data: Partial<WatchSeries>) => api.post<ApiResponse<WatchSeries>>('/watch-series', data),

  // 更新系列
  updateSeries: (id: number, data: Partial<WatchSeries>) => api.put<ApiResponse<WatchSeries>>(`/watch-series/${id}`, data),

  // 删除系列
  deleteSeries: (id: number) => api.delete<ApiResponse<void>>(`/watch-series/${id}`),

  // 更新系列状态
  updateSeriesStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/watch-series/${id}/status`, { status }),
}
