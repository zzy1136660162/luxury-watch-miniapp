import type { Menu } from '#/global'

const systemMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '系统管理',
      icon: 'i-ant-design:setting-twotone',
    },
    children: [
      {
        path: '/system/admin',
        meta: {
          title: '管理员管理',
          icon: 'i-ant-design:user-twotone',
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

export default systemMenu
