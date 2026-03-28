import type { RecursiveRequired, Settings } from '#/global'
import { cloneDeep } from 'es-toolkit'
import settingsDefault from '@/settings.default'
import { merge } from '@/utils/object'

const globalSettings: Settings.all = {
  // 应用配置
  app: {
    enablePermission: true, // 开启权限控制
    routeBaseOn: 'backend', // 从后端获取路由
  },
  // 菜单配置
  menu: {
    baseOn: 'backend', // 从后端获取菜单
  },
}

export default merge(globalSettings, cloneDeep(settingsDefault)) as RecursiveRequired<Settings.all>
