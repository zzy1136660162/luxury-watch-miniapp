import api from '../index'
import type { HomeBanner, HomeRecommend, SearchHot, PageResult, ApiResponse } from '@/types'

export default {
  // ==================== 首页轮播图 ====================
  
  // 获取轮播图列表
  getBannerList: (params?: { status?: number }) => 
    api.get<ApiResponse<PageResult<HomeBanner>>>('/home/banner/list', { params }),

  // 获取轮播图详情
  getBannerDetail: (id: number) => api.get<ApiResponse<HomeBanner>>(`/home/banner/${id}`),

  // 创建轮播图
  createBanner: (data: Partial<HomeBanner>) => api.post<ApiResponse<HomeBanner>>('/home/banner', data),

  // 更新轮播图
  updateBanner: (id: number, data: Partial<HomeBanner>) => api.put<ApiResponse<HomeBanner>>(`/home/banner/${id}`, data),

  // 删除轮播图
  deleteBanner: (id: number) => api.delete<ApiResponse<void>>(`/home/banner/${id}`),

  // 更新轮播图排序
  updateBannerSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/home/banner/${id}/sort`, { sort }),

  // 更新轮播图状态
  updateBannerStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/home/banner/${id}/status`, { status }),

  // ==================== 首页推荐 ====================
  
  // 获取推荐列表
  getRecommendList: (params?: { type?: number }) => 
    api.get<ApiResponse<PageResult<HomeRecommend>>>('/home/recommend/list', { params }),

  // 添加推荐
  addRecommend: (data: Partial<HomeRecommend>) => api.post<ApiResponse<HomeRecommend>>('/home/recommend', data),

  // 删除推荐
  deleteRecommend: (id: number) => api.delete<ApiResponse<void>>(`/home/recommend/${id}`),

  // 更新推荐排序
  updateRecommendSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/home/recommend/${id}/sort`, { sort }),

  // ==================== 热门搜索 ====================
  
  // 获取热门搜索列表
  getHotSearchList: (params?: { status?: number }) => 
    api.get<ApiResponse<PageResult<SearchHot>>>('/search/hot/list', { params }),

  // 创建热门搜索
  createHotSearch: (data: Partial<SearchHot>) => api.post<ApiResponse<SearchHot>>('/search/hot', data),

  // 更新热门搜索
  updateHotSearch: (id: number, data: Partial<SearchHot>) => api.put<ApiResponse<SearchHot>>(`/search/hot/${id}`, data),

  // 删除热门搜索
  deleteHotSearch: (id: number) => api.delete<ApiResponse<void>>(`/search/hot/${id}`),

  // 更新热门搜索排序
  updateHotSearchSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/search/hot/${id}/sort`, { sort }),

  // 更新热门搜索状态
  updateHotSearchStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/search/hot/${id}/status`, { status }),
}
