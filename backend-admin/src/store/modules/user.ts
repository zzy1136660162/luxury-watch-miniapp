import apiAdmin from '@/api/modules/admin'
import router from '@/router'

// 调试模式
const DEBUG = true

export const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const settingsStore = useSettingsStore()
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()
    const tabbarStore = useTabbarStore()

    const account = ref(localStorage.account ?? '')
    const token = ref(localStorage.token ?? '')
    const avatar = ref(localStorage.avatar ?? '')
    const nickname = ref(localStorage.nickname ?? '')
    const permissions = ref<string[]>([])
    const isLogin = computed(() => {
      if (token.value) {
        DEBUG && console.log('[UserStore] isLogin computed:', true, 'token:', token.value)
        return true
      }
      DEBUG && console.log('[UserStore] isLogin computed:', false)
      return false
    })

    // 登录
    async function login(data: {
      account: string
      password: string
    }) {
      DEBUG && console.log('[UserStore] login 开始, 账号:', data.account)
      const res: any = await apiAdmin.login({
        username: data.account,
        password: data.password,
      })

      DEBUG && console.log('[UserStore] login 成功, 响应:', res)

      // 保存 token 和用户信息
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('account', data.account)
      localStorage.setItem('avatar', res.data.userInfo.avatar || '')
      localStorage.setItem('nickname', res.data.userInfo.nickname || '')

      token.value = res.data.token
      account.value = data.account
      avatar.value = res.data.userInfo.avatar || ''
      nickname.value = res.data.userInfo.nickname || ''

      // 如果有用户信息中的角色，设置为权限
      if (res.data.userInfo.roles) {
        permissions.value = res.data.userInfo.roles
      }

      DEBUG && console.log('[UserStore] login 完成, token:', token.value, 'isLogin:', isLogin.value)
    }

    // 手动登出
    function logout(redirect = router.currentRoute.value.fullPath) {
      DEBUG && console.log('[UserStore] logout 调用, redirect:', redirect)
      // 调用后端登出接口
      apiAdmin.logout().finally(() => {
        DEBUG && console.log('[UserStore] logout finally, 清除状态')
        // 清除本地状态
        localStorage.removeItem('token')
        token.value = ''
        router.push({
          name: 'login',
          query: {
            ...(redirect !== settingsStore.settings.home.fullPath && router.currentRoute.value.name !== 'login' && { redirect }),
          },
        }).then(logoutCleanStatus)
      })
    }

    // 请求登出 (401 时调用)
    function requestLogout() {
      DEBUG && console.log('[UserStore] requestLogout 调用, 当前路由:', router.currentRoute.value.name)
      DEBUG && console.log('[UserStore] requestLogout, 当前 token:', token.value)
      DEBUG && console.log('[UserStore] requestLogout, localStorage token:', localStorage.token)
      // 清除本地状态
      localStorage.removeItem('token')
      token.value = ''
      router.push({
        name: 'login',
        query: {
          ...(
            router.currentRoute.value.fullPath !== settingsStore.settings.home.fullPath
            && router.currentRoute.value.name !== 'login'
            && {
              redirect: router.currentRoute.value.fullPath,
            }
          ),
        },
      }).then(logoutCleanStatus)
    }

    // 登出后清除状态
    function logoutCleanStatus() {
      DEBUG && console.log('[UserStore] logoutCleanStatus, 清除所有状态')
      localStorage.removeItem('account')
      localStorage.removeItem('avatar')
      localStorage.removeItem('nickname')
      account.value = ''
      avatar.value = ''
      nickname.value = ''
      permissions.value = []
      settingsStore.updateSettings({}, true)
      tabbarStore.clean()
      routeStore.removeRoutes()
      menuStore.setActived(0)
    }

    // 获取权限
    async function getPermissions() {
      DEBUG && console.log('[UserStore] getPermissions 开始')
      try {
        const res: any = await apiAdmin.getPermission()
        DEBUG && console.log('[UserStore] getPermissions 成功:', res)
        permissions.value = res.data.permissions || []
        // 也保存角色信息
        if (res.data.roles) {
          permissions.value = [...permissions.value, ...res.data.roles]
        }
        DEBUG && console.log('[UserStore] permissions:', permissions.value)
      } catch (error) {
        DEBUG && console.error('[UserStore] getPermissions 失败:', error)
        throw error
      }
    }

    // 获取用户信息
    async function getUserInfo() {
      DEBUG && console.log('[UserStore] getUserInfo 开始')
      try {
        const res: any = await apiAdmin.getUserInfo()
        DEBUG && console.log('[UserStore] getUserInfo 成功:', res)
        if (res.data) {
          localStorage.setItem('avatar', res.data.avatar || '')
          localStorage.setItem('nickname', res.data.nickname || '')
          avatar.value = res.data.avatar || ''
          nickname.value = res.data.nickname || ''
          account.value = res.data.username || account.value
        }
      } catch (error) {
        DEBUG && console.error('[UserStore] getUserInfo 失败:', error)
        throw error
      }
    }

    // 修改密码
    async function editPassword(data: {
      password: string
      newPassword: string
    }) {
      await apiAdmin.passwordEdit(data)
    }

    return {
      account,
      token,
      avatar,
      nickname,
      permissions,
      isLogin,
      login,
      logout,
      requestLogout,
      getPermissions,
      getUserInfo,
      editPassword,
    }
  },
)
