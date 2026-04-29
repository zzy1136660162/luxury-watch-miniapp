import type { Menu } from '#/global'

const menu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '门店管理',
      icon: 'i-ant-design:shop-twotone',
    },
    children: [
      {
        path: '/store',
        meta: {
          title: '门店列表',
          icon: 'i-ant-design:shop-outlined',
        },
      },
    ],
  },
  {
    meta: {
      title: '预约管理',
      icon: 'i-ant-design:calendar-outlined',
    },
    children: [
      {
        path: '/appointment',
        meta: {
          title: '预约列表',
          icon: 'i-ant-design:calendar-check-outline',
        },
      },
    ],
  },
  {
    meta: {
      title: '商品管理',
      icon: 'i-ant-design:shopping-outlined',
    },
    children: [
      {
        path: '/product/list',
        meta: {
          title: '商品列表',
          icon: 'i-ant-design:unordered-list-outlined',
        },
      },
      {
        path: '/product/brand',
        meta: {
          title: '品牌管理',
          icon: 'i-ant-design:trademark-circle-outlined',
        },
      },
      {
        path: '/product/series',
        meta: {
          title: '系列管理',
          icon: 'i-ant-design:appstore-twotone',
        },
      },
      {
        path: '/product/category',
        meta: {
          title: '商品分类',
          icon: 'i-ant-design:appstore-outlined',
        },
      },
    ],
  },
  {
    meta: {
      title: '兑换管理',
      icon: 'i-ant-design:gift-outlined',
    },
    children: [
      {
        path: '/exchange',
        meta: {
          title: '兑换记录',
          icon: 'i-ant-design:swap-outlined',
        },
      },
    ],
  },
  {
    meta: {
      title: '系统管理',
      icon: 'i-ant-design:setting-twotone',
    },
    children: [
      {
        path: '/system/user',
        meta: {
          title: '用户管理',
          icon: 'i-ant-design:team-outlined',
        },
      },
      {
        path: '/system/admin',
        meta: {
          title: '管理员管理',
          icon: 'i-ant-design:user-outlined',
        },
      },
      {
        path: '/system/menu',
        meta: {
          title: '菜单管理',
          icon: 'i-ant-design:menu-twotone',
        },
      },
    ],
  },
]

export default menu
