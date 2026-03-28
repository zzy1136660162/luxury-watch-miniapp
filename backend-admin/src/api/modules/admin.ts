import api from '../index'

export default {
  // 登录
  login: (data: { username: string; password: string }) =>
    api.post('/admin/login', data),

  // 获取用户信息
  getUserInfo: () => api.get('/admin/info'),

  // 获取权限
  getPermission: () => api.get('/admin/permission'),

  // 获取菜单
  getMenus: () => api.get('/admin/menus'),

  // 登出
  logout: () => api.post('/admin/logout'),
}
