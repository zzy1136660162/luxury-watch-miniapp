import axios from 'axios'
// import qs from 'qs'
import { toast } from 'vue-sonner'

// 调试模式
const DEBUG = true

// 请求重试配置
const MAX_RETRY_COUNT = 3 // 最大重试次数
const RETRY_DELAY = 1000 // 重试延迟时间（毫秒）

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  export interface AxiosRequestConfig {
    retry?: boolean
    retryCount?: number
  }
}

const api = axios.create({
  baseURL: (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 600,
  responseType: 'json',
})

api.interceptors.request.use(
  (request) => {
    // 全局拦截请求发送前提交的参数
    const userStore = useUserStore()
    // 设置请求头
    if (request.headers) {
      if (userStore.isLogin) {
        // 使用 Authorization header 携带 Token
        request.headers.Authorization = userStore.token
        DEBUG && console.log('[API] 请求添加 Token:', request.url, 'Token:', userStore.token)
      } else {
        DEBUG && console.log('[API] 请求未添加 Token (未登录):', request.url)
      }
    }
    DEBUG && console.log('[API] 请求发送:', request.method?.toUpperCase(), request.url, request)
    // 是否将 POST 请求参数进行字符串化处理
    if (request.method === 'post') {
      // request.data = qs.stringify(request.data, {
      //   arrayFormat: 'brackets',
      // })
    }
    return request
  },
)

// 处理错误信息的函数
function handleError(error: any) {
  DEBUG && console.error('[API] 请求错误:', error)
  DEBUG && console.error('[API] 错误状态:', error.response?.status)
  DEBUG && console.error('[API] 错误数据:', error.response?.data)
  // 处理 401 未授权
  if (error.response?.status === 401) {
    DEBUG && console.log('[API] 收到 401, 调用 requestLogout')
    useUserStore().requestLogout()
  }
  else {
    let message = error.message || error.response?.data?.msg || '请求失败'
    if (message === 'Network Error') {
      message = '后端网络故障'
    }
    else if (message.includes('timeout')) {
      message = '接口请求超时'
    }
    else if (message.includes('Request failed with status code')) {
      message = `接口${message.substr(message.length - 3)}异常`
    }
    toast.error('Error', {
      description: message,
    })
  }
  return Promise.reject(error)
}

api.interceptors.response.use(
  (response) => {
    DEBUG && console.log('[API] 响应成功:', response.config.url, response.data)
    /**
     * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
     * 适配后端返回格式: { code: 200, msg: 'success', data: {} }
     * 规则是当 code 为 200 时表示请求成功，其他需要提示错误
     */
    if (typeof response.data === 'object') {
      if (response.data.code === 200) {
        // 成功，不做处理
      }
      else {
        // 业务错误
        DEBUG && console.warn('[API] 业务错误:', response.data.code, response.data.msg)
        toast.error('Error', {
          description: response.data.msg || '请求失败',
        })
        return Promise.reject(response.data)
      }
      return Promise.resolve(response.data)
    }
    else {
      return Promise.reject(response.data)
    }
  },
  async (error) => {
    DEBUG && console.error('[API] 响应错误:', error)
    // 获取请求配置
    const config = error.config
    // 如果配置不存在或未启用重试，则直接处理错误
    if (!config || !config.retry) {
      return handleError(error)
    }
    // 设置重试次数
    config.retryCount = config.retryCount || 0
    // 判断是否超过重试次数
    if (config.retryCount >= MAX_RETRY_COUNT) {
      return handleError(error)
    }
    // 重试次数自增
    config.retryCount += 1
    // 延迟重试
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
    // 重新发起请求
    return api(config)
  },
)

export default api
