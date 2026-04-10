import api from '@/api'

export const storeApi = {
  list: (params?: { page?: number; size?: number; name?: string }) => {
    return api.get('/admin/store/list', { params })
  },

  detail: (id: number) => {
    return api.get(`/admin/store/${id}`)
  },

  create: (data: any) => {
    return api.post('/admin/store', data)
  },

  update: (id: number, data: any) => {
    return api.put(`/admin/store/${id}`, data)
  },

  delete: (id: number) => {
    return api.delete(`/admin/store/${id}`)
  }
}
