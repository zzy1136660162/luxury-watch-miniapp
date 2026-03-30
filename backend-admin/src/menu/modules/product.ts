import type { Menu } from '#/global'

const productMenu: Menu.recordMainRaw[] = [
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
    ],
  },
]

export default productMenu
