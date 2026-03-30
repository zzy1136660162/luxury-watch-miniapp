import api from '../index'
import type { 
  MemberPrivilege, 
  MemberBenefit, 
  MemberPointsRecord,
  Appointment,
  WxUser,
  PageResult, 
  ApiResponse 
} from '@/types'

export default {
  // ==================== 小程序用户管理 ====================
  
  // 获取用户列表
  getUserList: (params: {
    page?: number
    size?: number
    keyword?: string
    memberLevel?: number
  }) => api.get<ApiResponse<PageResult<WxUser>>>('/wx-user/list', { params }),

  // 获取用户详情
  getUserDetail: (id: number) => api.get<ApiResponse<WxUser>>(`/wx-user/${id}`),

  // 更新用户状态
  updateUserStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/wx-user/${id}/status`, { status }),

  // 更新用户会员等级
  updateUserLevel: (id: number, level: number) => api.put<ApiResponse<void>>(`/wx-user/${id}/level`, { level }),

  // 调整用户积分
  adjustUserPoints: (id: number, points: number, description: string) => 
    api.post<ApiResponse<void>>(`/wx-user/${id}/points`, { points, description }),

  // ==================== 会员权益 ====================
  
  // 获取权益列表
  getPrivilegeList: (params?: { status?: number }) => 
    api.get<ApiResponse<PageResult<MemberPrivilege>>>('/member/privilege/list', { params }),

  // 获取权益详情
  getPrivilegeDetail: (id: number) => api.get<ApiResponse<MemberPrivilege>>(`/member/privilege/${id}`),

  // 创建权益
  createPrivilege: (data: Partial<MemberPrivilege>) => api.post<ApiResponse<MemberPrivilege>>('/member/privilege', data),

  // 更新权益
  updatePrivilege: (id: number, data: Partial<MemberPrivilege>) => api.put<ApiResponse<MemberPrivilege>>(`/member/privilege/${id}`, data),

  // 删除权益
  deletePrivilege: (id: number) => api.delete<ApiResponse<void>>(`/member/privilege/${id}`),

  // 更新权益排序
  updatePrivilegeSort: (id: number, sort: number) => api.put<ApiResponse<void>>(`/member/privilege/${id}/sort`, { sort }),

  // ==================== 会员礼遇 ====================
  
  // 获取礼遇列表
  getBenefitList: (params?: {
    page?: number
    size?: number
    category?: number
    status?: number
  }) => api.get<ApiResponse<PageResult<MemberBenefit>>>('/member/benefit/list', { params }),

  // 获取礼遇详情
  getBenefitDetail: (id: number) => api.get<ApiResponse<MemberBenefit>>(`/member/benefit/${id}`),

  // 创建礼遇
  createBenefit: (data: Partial<MemberBenefit>) => api.post<ApiResponse<MemberBenefit>>('/member/benefit', data),

  // 更新礼遇
  updateBenefit: (id: number, data: Partial<MemberBenefit>) => api.put<ApiResponse<MemberBenefit>>(`/member/benefit/${id}`, data),

  // 删除礼遇
  deleteBenefit: (id: number) => api.delete<ApiResponse<void>>(`/member/benefit/${id}`),

  // 更新礼遇状态
  updateBenefitStatus: (id: number, status: number) => api.put<ApiResponse<void>>(`/member/benefit/${id}/status`, { status }),

  // ==================== 积分记录 ====================
  
  // 获取积分记录列表
  getPointsRecordList: (params: {
    page?: number
    size?: number
    userId?: number
    type?: number
  }) => api.get<ApiResponse<PageResult<MemberPointsRecord>>>('/member/points-record/list', { params }),

  // ==================== 预约管理 ====================
  
  // 获取预约列表
  getAppointmentList: (params: {
    page?: number
    size?: number
    type?: number
    status?: number
    keyword?: string
  }) => api.get<ApiResponse<PageResult<Appointment>>>('/appointment/list', { params }),

  // 获取预约详情
  getAppointmentDetail: (id: number) => api.get<ApiResponse<Appointment>>(`/appointment/${id}`),

  // 确认预约
  confirmAppointment: (id: number, handleRemark?: string) => 
    api.put<ApiResponse<void>>(`/appointment/${id}/confirm`, { handleRemark }),

  // 完成预约
  completeAppointment: (id: number, handleRemark?: string) => 
    api.put<ApiResponse<void>>(`/appointment/${id}/complete`, { handleRemark }),

  // 取消预约
  cancelAppointment: (id: number, handleRemark: string) => 
    api.put<ApiResponse<void>>(`/appointment/${id}/cancel`, { handleRemark }),
}
