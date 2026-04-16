import type { Menu } from '#/global'

const orderMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '订单管理',
      icon: 'i-ant-design:ordered-list-outlined',
    },
    children: [
      {
        path: '/order/list',
        meta: {
          title: '订单列表',
          icon: 'i-ant-design:unordered-list-outlined',
        },
      },
    ],
  },
]

export default orderMenu