import api from '../index'
import type { ApiResponse } from '@/types'

export default {
  // 登录
  login: (data: { username: string; password: string }) =>
    api.post('/admin/login', data),

  // 注册
  register: (data: { username: string; password: string }) =>
    api.post<ApiResponse<void>>('/admin/register', data),

  // 获取用户信息
  getUserInfo: () => api.get('/admin/info'),

  // 获取权限
  getPermission: () => api.get('/admin/permission'),

  // 获取菜单
  getMenus: () => api.get('/admin/menus'),

  // 登出
  logout: () => api.post('/admin/logout'),

  // 管理员管理
  getAdminUsers: (params?: { keyword?: string; status?: number }) =>
    api.get<ApiResponse<any[]>>('/admin/users', { params }),

  createAdminUser: (data: any) =>
    api.post('/admin/users', data),

  updateAdminUser: (id: number, data: any) =>
    api.put(`/admin/users/${id}`, data),

  deleteAdminUser: (id: number) =>
    api.delete(`/admin/users/${id}`),
}
