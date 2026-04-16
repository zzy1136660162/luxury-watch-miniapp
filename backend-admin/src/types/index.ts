// 通用类型定义

// API响应结构
export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  size: number
}

// 分页参数
export interface PageParams {
  page?: number
  size?: number
}

// ==================== 商品相关 ====================

// 商品
export interface Product {
  id: number
  name: string
  code: string
  category: string
  image?: string
  price: number
  stock: number
  sales?: number
  points?: number
  description?: string
  status: number
  createTime?: string
  updateTime?: string
}

// ==================== 腕表相关 ====================

// 腕表
export interface Watch {
  id: number
  seriesId?: number
  seriesName?: string
  name: string
  nameEn?: string
  subtitle?: string
  subtitleEn?: string
  mainImage?: string
  images?: string[]
  detail?: string
  price?: number
  // 腕表参数
  caseSize?: string
  caseMaterial?: string
  dialColor?: string
  movementType?: string
  movementModel?: string
  powerReserve?: string
  waterResistance?: string
  strapMaterial?: string
  strapColor?: string
  crystal?: string
  functions?: string
  // 标签
  isHot: boolean
  isNew: boolean
  isRecommend: boolean
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 腕表系列
export interface WatchSeries {
  id: number
  name: string
  nameEn?: string
  slogan?: string
  sloganEn?: string
  description?: string
  descriptionEn?: string
  coverImage?: string
  bannerImage?: string
  story?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// ==================== 品牌相关 ====================

// 品牌历史里程碑
export interface BrandMilestone {
  id: number
  year: string
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  image?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 工艺展示
export interface BrandCraft {
  id: number
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  image?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 品牌资讯
export interface BrandNews {
  id: number
  title: string
  titleEn?: string
  summary?: string
  summaryEn?: string
  content?: string
  contentEn?: string
  coverImage?: string
  publishTime?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// ==================== 会员相关 ====================

// 小程序用户
export interface WxUser {
  id: number
  openid: string
  unionid?: string
  nickname?: string
  avatar?: string
  phone?: string
  gender: number
  birthday?: string
  memberLevel: number
  memberPoints: number
  status: number
  lastLoginTime?: string
  createTime?: string
  updateTime?: string
}

// 会员权益
export interface MemberPrivilege {
  id: number
  title: string
  titleEn?: string
  description?: string
  icon?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 会员礼遇
export interface MemberBenefit {
  id: number
  category: number
  title: string
  subtitle?: string
  image?: string
  description?: string
  pointsRequired: number
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 积分记录
export interface MemberPointsRecord {
  id: number
  userId: number
  type: number
  points: number
  description?: string
  createTime?: string
}

// 积分兑换记录
export interface ExchangeRecord {
  id: number
  userId: number
  userName?: string
  productId: number
  productName: string
  productImage?: string
  points: number
  phone?: string
  exchangeTime?: string
  status: number
}

// ==================== 订单相关 ====================

// 订单
export interface Order {
  id: number
  orderNo: string
  userId: number
  userName?: string
  totalAmount: number
  status: number
  createTime?: string
  updateTime?: string
  orderItems?: OrderItem[]
}

// 订单项
export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productImage?: string
  price: number
  quantity: number
  createTime?: string
}

// 订单状态
export enum OrderStatus {
  PENDING = 1,    // 待支付
  PAID = 2,       // 已支付
  COMPLETED = 3,  // 已完成
  CANCELLED = 4,  // 已取消
}

// 订单状态文本
export const OrderStatusText: Record<number, string> = {
  [OrderStatus.PENDING]: '待支付',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消',
}

// 订单状态类型
export const OrderStatusType: Record<number, string> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.PAID]: 'success',
  [OrderStatus.COMPLETED]: 'info',
  [OrderStatus.CANCELLED]: 'danger',
}

// 预约
export interface Appointment {
  id: number
  userId: number
  userName?: string
  type: number
  name: string
  phone: string
  email?: string
  preferredDate?: string
  preferredTime?: string
  remark?: string
  status: number
  handleRemark?: string
  createTime?: string
  updateTime?: string
}

// ==================== 首页配置相关 ====================

// 首页轮播图
export interface HomeBanner {
  id: number
  title?: string
  subtitle?: string
  image: string
  linkType: number
  linkId?: number
  linkUrl?: string
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// 首页推荐
export interface HomeRecommend {
  id: number
  type: number
  watchId: number
  watchName?: string
  watchImage?: string
  sort?: number
  createTime?: string
}

// 热门搜索
export interface SearchHot {
  id: number
  keyword: string
  searchCount: number
  sort?: number
  status: number
  createTime?: string
  updateTime?: string
}

// ==================== 枚举常量 ====================

// 会员等级
export enum MemberLevel {
  NORMAL = 1,
  SILVER = 2,
  GOLD = 3,
  PLATINUM = 4,
  DIAMOND = 5,
}

// 会员等级文本
export const MemberLevelText: Record<number, string> = {
  [MemberLevel.NORMAL]: '普通会员',
  [MemberLevel.SILVER]: '银卡会员',
  [MemberLevel.GOLD]: '金卡会员',
  [MemberLevel.PLATINUM]: '白金会员',
  [MemberLevel.DIAMOND]: '钻石会员',
}

// 会员礼遇分类
export enum BenefitCategory {
  EXCLUSIVE = 1,
  EVENT = 2,
  SERVICE = 3,
}

// 会员礼遇分类文本
export const BenefitCategoryText: Record<number, string> = {
  [BenefitCategory.EXCLUSIVE]: '专属礼遇',
  [BenefitCategory.EVENT]: '专属活动',
  [BenefitCategory.SERVICE]: '专属服务',
}

// 预约类型
export enum AppointmentType {
  VISIT = 1,
  MAINTENANCE = 2,
  CONSULT = 3,
}

// 预约类型文本
export const AppointmentTypeText: Record<number, string> = {
  [AppointmentType.VISIT]: '到店品鉴',
  [AppointmentType.MAINTENANCE]: '预约保养',
  [AppointmentType.CONSULT]: '专属咨询',
}

// 预约状态
export enum AppointmentStatus {
  PENDING = 0,
  CONFIRMED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

// 预约状态文本
export const AppointmentStatusText: Record<number, string> = {
  [AppointmentStatus.PENDING]: '待处理',
  [AppointmentStatus.CONFIRMED]: '已确认',
  [AppointmentStatus.COMPLETED]: '已完成',
  [AppointmentStatus.CANCELLED]: '已取消',
}

// 轮播图链接类型
export enum BannerLinkType {
  WATCH = 1,
  SERIES = 2,
  PAGE = 3,
  NEWS = 4,
}

// 首页推荐类型
export enum RecommendType {
  HOT = 1,
  NEW = 2,
  LIMITED = 3,
}

// 首页推荐类型文本
export const RecommendTypeText: Record<number, string> = {
  [RecommendType.HOT]: '热门系列',
  [RecommendType.NEW]: '新品上市',
  [RecommendType.LIMITED]: '限量臻品',
}
