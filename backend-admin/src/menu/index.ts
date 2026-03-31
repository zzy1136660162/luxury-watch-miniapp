import type { Menu } from '#/global'

import WatchMenu from './modules/watch'
import BrandMenu from './modules/brand'
import MemberMenu from './modules/member'
import HomeMenu from './modules/home'
import ProductMenu from './modules/product'
import SystemMenu from './modules/system'

const menu: Menu.recordMainRaw[] = [
  // 首页配置
  ...HomeMenu,
  // 系统管理
  ...SystemMenu,
  // 商品管理
  ...ProductMenu,
  // 腕表管理
  ...WatchMenu,
  // 品牌管理
  ...BrandMenu,
  // 会员管理
  ...MemberMenu,
]

export default menu
