import type { Route } from '#/global'
import type { RouteRecordRaw, RouterMatcher } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { createRouterMatcher } from 'vue-router'
import apiApp from '@/api/modules/app'
import { systemRoutes as systemRoutesRaw } from '@/router/routes'

export const useRouteStore = defineStore(
  // 唯一ID
  'route',
  () => {
    const settingsStore = useSettingsStore()

    const isGenerate = ref(false)
    // 原始路由
    const routesRaw = ref<Route.recordMainRaw[]>([])
    // 文件系统原始路由
    const filesystemRoutesRaw = ref<RouteRecordRaw[]>([])
    // 已注册的路由，用于登出时删除路由
    const currentRemoveRoutes = ref<(() => void)[]>([])

    // 实际路由
    const routes = computed(() => {
      const returnRoutes: RouteRecordRaw[] = []
      if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
        if (routesRaw.value && routesRaw.value.length > 0) {
          routesRaw.value.forEach((item) => {
            // 先添加父路由（目录类型）
            if (item.path && item.component) {
              returnRoutes.push(cloneDeep(item) as RouteRecordRaw)
            }
            // 再添加子路由
            if (item.children && item.children.length > 0) {
              const tmpRoutes = cloneDeep(item.children) as RouteRecordRaw[]
              tmpRoutes.map((v) => {
                if (!v.meta) {
                  v.meta = {}
                }
                v.meta.auth = item.meta?.auth ?? v.meta?.auth
                return v
              })
              returnRoutes.push(...tmpRoutes)
            }
          })
          returnRoutes.forEach((item) => {
            if (item.children) {
              item.children = deleteMiddleRouteComponent(item.children)
            }
            return item
          })
        }
      }
      else {
        returnRoutes.push(...cloneDeep(filesystemRoutesRaw.value) as RouteRecordRaw[])
      }
      return returnRoutes
    })
    // 系统路由
    const systemRoutes = computed(() => {
      const routes = [...systemRoutesRaw]
      routes.forEach((item) => {
        if (item.children) {
          item.children = deleteMiddleRouteComponent(item.children)
        }
      })
      return routes
    })
    // 删除路由中间层级对应的组件
    function deleteMiddleRouteComponent(routes: RouteRecordRaw[]) {
      const res: RouteRecordRaw[] = []
      routes.forEach((route) => {
        if (route.children?.length) {
          delete route.component
          route.children = deleteMiddleRouteComponent(route.children)
        }
        else {
          delete route.children
        }
        res.push(route)
      })
      return res
    }

    // 路由匹配器
    const routesMatcher = ref<RouterMatcher>()
    // 根据路径获取匹配的路由
    function getRouteMatchedByPath(path: string) {
      return routesMatcher.value?.resolve({ path }, undefined!)?.matched ?? []
    }

    // 生成路由（前端生成）
    function generateRoutesAtFront(asyncRoutes: Route.recordMainRaw[]) {
      // 设置 routes 数据
      routesRaw.value = cloneDeep(asyncRoutes) as any
      // 创建路由匹配器 - 展平所有路由
      const routes: RouteRecordRaw[] = []

      function flattenRoutes(routes: Route.recordMainRaw[], parentAuth?: string): RouteRecordRaw[] {
        const result: RouteRecordRaw[] = []
        routes.forEach((route) => {
          // 合并权限
          const auth = parentAuth || route.meta?.auth
          const routeRecord = cloneDeep(route) as RouteRecordRaw
          if (auth && routeRecord.meta) {
            routeRecord.meta.auth = auth
          }
          if (routeRecord.children && routeRecord.children.length > 0) {
            result.push(routeRecord)
            result.push(...flattenRoutes(routeRecord.children as RouteRecordRaw[], auth))
          } else {
            result.push(routeRecord)
          }
        })
        return result
      }

      routesRaw.value.forEach((route) => {
        if (route.children) {
          routes.push(...flattenRoutes(route.children as RouteRecordRaw[]))
        }
      })
      routesMatcher.value = createRouterMatcher(routes, {})
      isGenerate.value = true
    }
    // 格式化后端路由数据
    function formatBackRoutes(routes: any, views = import.meta.glob('../../views/**/*.vue')): Route.recordMainRaw[] {
      if (!routes || !Array.isArray(routes)) {
        console.warn('[Route] formatBackRoutes: routes is not a valid array', routes)
        return []
      }
      return routes.map((route: any, index: number) => {
        // 防御性检查：跳过无效路由
        if (!route || typeof route !== 'object') {
          console.warn(`[Route] formatBackRoutes: skipping invalid route at index ${index}`, route)
          return null
        }
        if (!route.path) {
          console.warn(`[Route] formatBackRoutes: skipping route without path at index ${index}`, route)
          return null
        }

        console.log(`[Route] formatBackRoutes processing route[${index}]:`, route.path, 'component:', route.component)

        // 处理 Layout 组件名称（兼容 LAYOUT 和 Layout）
        const componentStr = route.component
        if (componentStr && (componentStr.toUpperCase() === 'LAYOUT' || componentStr === 'Layout')) {
          route.component = () => import('@/layouts/index.vue')
        }
        else if (componentStr) {
          // 处理组件路径，添加 .vue 后缀（如果没有的话）
          // 移除开头的斜杠，避免产生双斜杠路径
          const cleanPath = componentStr.startsWith('/') ? componentStr.substring(1) : componentStr
          let viewPath = `../../views/${cleanPath}`
          if (!viewPath.endsWith('.vue')) {
            viewPath = `${viewPath}.vue`
          }
          console.log(`[Route] Looking up view:`, viewPath, 'exists:', !!views[viewPath])
          route.component = views[viewPath]
          if (!route.component) {
            console.warn(`[Route] View not found for component:`, route.component, 'tried:', viewPath)
            delete route.component
          }
        }
        else {
          delete route.component
        }
        if (route.children) {
          route.children = formatBackRoutes(route.children, views)
          // 过滤掉 null 值
          route.children = route.children.filter((c: any) => c !== null)
        }
        return route
      }).filter((r: any) => r !== null)
    }
    // 生成路由（后端获取）
    async function generateRoutesAtBack() {
      console.log('[Route] 开始调用 routeList API')
      await apiApp.routeList().then((res) => {
        console.log('[Route] API response:', res)
        if (!res || !Array.isArray(res)) {
          console.error('[Route] API返回的不是有效数组:', res)
          throw new Error('API返回的不是有效数组')
        }
        // 设置 routes 数据
        routesRaw.value = formatBackRoutes(res) as any
        console.log('[Route] routesRaw after format:', routesRaw.value)
        // 创建路由匹配器 - 需要包含父路由和完整的嵌套结构
        const flatRoutes: RouteRecordRaw[] = []

        function flattenRoutes(routes: any[], parentAuth?: string): RouteRecordRaw[] {
          const result: RouteRecordRaw[] = []
          routes.forEach((route: any) => {
            // 合并权限
            const auth = parentAuth || route?.meta?.auth
            if (auth && route.meta) {
              route.meta.auth = auth
            }

            if (route.children && route.children.length > 0) {
              // 有子路由，先添加父路由
              result.push(cloneDeep(route) as RouteRecordRaw)
              // 递归处理子路由
              result.push(...flattenRoutes(route.children, auth))
            } else {
              // 没有子路由，添加自身
              result.push(cloneDeep(route) as RouteRecordRaw)
            }
          })
          return result
        }

        flatRoutes.push(...flattenRoutes(routesRaw.value))

        console.log('[Route] Flat routes:', flatRoutes)
        if (flatRoutes.length === 0) {
          console.warn('[Route] Warning: flatRoutes array is empty!')
          // 即使没有路由，也要设置 isGenerate 为 true，避免无限循环
          isGenerate.value = true
          return
        }
        try {
          routesMatcher.value = createRouterMatcher(flatRoutes, {})
        } catch (e) {
          console.error('[Route] createRouterMatcher error:', e)
          // 即使出错，也要设置 isGenerate 为 true，避免无限循环
          isGenerate.value = true
          throw e
        }
        isGenerate.value = true
      })
    }
    // 生成路由（文件系统生成）
    function generateRoutesAtFilesystem(asyncRoutes: RouteRecordRaw[]) {
      // 设置 routes 数据
      filesystemRoutesRaw.value = cloneDeep(asyncRoutes) as any
      isGenerate.value = true
    }
    // 记录 accessRoutes 路由，用于登出时删除路由
    function setCurrentRemoveRoutes(routes: (() => void)[]) {
      currentRemoveRoutes.value = routes
    }
    // 清空动态路由
    function removeRoutes() {
      isGenerate.value = false
      routesRaw.value = []
      filesystemRoutesRaw.value = []
      currentRemoveRoutes.value.forEach((removeRoute) => {
        removeRoute()
      })
      currentRemoveRoutes.value = []
    }

    return {
      isGenerate,
      routesRaw,
      currentRemoveRoutes,
      routes,
      systemRoutes,
      getRouteMatchedByPath,
      generateRoutesAtFront,
      generateRoutesAtBack,
      generateRoutesAtFilesystem,
      setCurrentRemoveRoutes,
      removeRoutes,
    }
  },
)
