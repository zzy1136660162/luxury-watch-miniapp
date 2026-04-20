import api from '@/api'

export const appointmentApi = {
  list: (params?: { page?: number; size?: number; status?: number }) => {
    return api.get('/admin/appointment/list', { params })
  },

  confirm: (id: number) => {
    return api.put(`/admin/appointment/${id}/confirm`)
  }
}
