import api from '../index'
import type { PageResult, ApiResponse } from '@/types'

export interface WxUser {
  id: number
  username: string
  nickname: string
  phone: string
  points: number
  memberLevel: number
  birthday: string
  gender: number
  status: number
  createTime: string
  lastLoginTime?: string
  avatar?: string
}

export default {
  // 获取小程序用户列表
  getWxUserList: (params: {
    page?: number
    size?: number
    keyword?: string
    phone?: string
    memberLevel?: number
    status?: number
  }) => api.get<ApiResponse<PageResult<WxUser>>>('/wx-user/list', { params }),

  // 获取小程序用户详情
  getWxUserDetail: (id: number) => api.get<ApiResponse<WxUser>>(`/wx-user/${id}`),

  // 更新小程序用户状态
  updateWxUserStatus: (id: number, status: number) =>
    api.put<ApiResponse<void>>(`/wx-user/${id}/status?status=${status}`),

  // 更新小程序用户会员等级
  updateWxUserLevel: (id: number, level: number) =>
    api.put<ApiResponse<void>>(`/wx-user/${id}/level`, { level }),

  // 调整小程序用户积分
  adjustWxUserPoints: (id: number, points: number, description: string) =>
    api.post<ApiResponse<void>>(`/wx-user/${id}/points?points=${points}&description=${encodeURIComponent(description)}`),

  // 更新小程序用户信息
  updateWxUser: (id: number, data: Partial<WxUser>) =>
    api.put<ApiResponse<WxUser>>(`/wx-user/${id}`, data),

  // 重置小程序用户密码
  resetWxUserPassword: (id: number) =>
    api.put<ApiResponse<void>>(`/wx-user/${id}/reset-password`),
}
