import apiAdmin from '@/api/modules/admin'
import router from '@/router'

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
        return true
      }
      return false
    })

    // 登录
    async function login(data: {
      account: string
      password: string
    }) {
      const res: any = await apiAdmin.login({
        username: data.account,
        password: data.password,
      })

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
    }

    // 手动登出
    function logout(redirect = router.currentRoute.value.fullPath) {
      // 调用后端登出接口
      apiAdmin.logout().finally(() => {
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
      const res: any = await apiAdmin.getPermission()
      permissions.value = res.data.permissions || []
      // 也保存角色信息
      if (res.data.roles) {
        permissions.value = [...permissions.value, ...res.data.roles]
      }
    }

    // 获取用户信息
    async function getUserInfo() {
      const res: any = await apiAdmin.getUserInfo()
      if (res.data) {
        localStorage.setItem('avatar', res.data.avatar || '')
        localStorage.setItem('nickname', res.data.nickname || '')
        avatar.value = res.data.avatar || ''
        nickname.value = res.data.nickname || ''
        account.value = res.data.username || account.value
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
