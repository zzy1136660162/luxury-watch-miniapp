import api from '../index'
import type { BrandMilestone, BrandCraft, BrandNews, PageResult, ApiResponse } from '@/types'

export default {
  // ==================== 品牌历史里程碑 ====================

  // 获取里程碑列表
  getMilestoneList: (params?: {
    page?: number
    size?: number
    status?: number
  }) => api.get<ApiResponse<PageResult<BrandMilestone>>>('/brand/milestone/list', { params }),

  // 获取里程碑详情
  getMilestoneDetail: (id: number) => api.get<ApiResponse<BrandMilestone>>(`/brand/milestone/${id}`),

  // 创建里程碑
  createMilestone: (data: Partial<BrandMilestone>) => api.post<ApiResponse<BrandMilestone>>('/brand/milestone', data),

  // 更新里程碑
  updateMilestone: (id: number, data: Partial<BrandMilestone>) => api.put<ApiResponse<BrandMilestone>>(`/brand/milestone/${id}`, data),

  // 删除里程碑
  deleteMilestone: (id: number) => api.delete<ApiResponse<void>>(`/brand/milestone/${id}`),

  // 更新里程碑状态
  updateMilestoneStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/brand/milestone/${id}/status`, { status }),

  // 更新里程碑排序
  updateMilestoneSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/brand/milestone/${id}/sort`, { sort }),

  // ==================== 工艺展示 ====================

  // 获取工艺列表
  getCraftList: (params?: {
    page?: number
    size?: number
    status?: number
  }) => api.get<ApiResponse<PageResult<BrandCraft>>>('/brand/craft/list', { params }),

  // 获取工艺详情
  getCraftDetail: (id: number) => api.get<ApiResponse<BrandCraft>>(`/brand/craft/${id}`),

  // 创建工艺
  createCraft: (data: Partial<BrandCraft>) => api.post<ApiResponse<BrandCraft>>('/brand/craft', data),

  // 更新工艺
  updateCraft: (id: number, data: Partial<BrandCraft>) => api.put<ApiResponse<BrandCraft>>(`/brand/craft/${id}`, data),

  // 删除工艺
  deleteCraft: (id: number) => api.delete<ApiResponse<void>>(`/brand/craft/${id}`),

  // 更新工艺状态
  updateCraftStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/brand/craft/${id}/status`, { status }),

  // 更新工艺排序
  updateCraftSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/brand/craft/${id}/sort`, { sort }),

  // ==================== 品牌资讯 ====================

  // 获取资讯列表
  getNewsList: (params?: {
    page?: number
    size?: number
    keyword?: string
    status?: number
  }) => api.get<ApiResponse<PageResult<BrandNews>>>('/brand/news/list', { params }),

  // 获取资讯详情
  getNewsDetail: (id: number) => api.get<ApiResponse<BrandNews>>(`/brand/news/${id}`),

  // 创建资讯
  createNews: (data: Partial<BrandNews>) => api.post<ApiResponse<BrandNews>>('/brand/news', data),

  // 更新资讯
  updateNews: (id: number, data: Partial<BrandNews>) => api.put<ApiResponse<BrandNews>>(`/brand/news/${id}`, data),

  // 删除资讯
  deleteNews: (id: number) => api.delete<ApiResponse<void>>(`/brand/news/${id}`),

  // 更新资讯状态
  updateNewsStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/brand/news/${id}/status`, { status }),

  // 发布资讯
  publishNews: (id: number) => api.put<ApiResponse<void>>(`/brand/news/${id}/publish`),
}
