import type { Menu } from '#/global'

const memberMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '会员管理',
      icon: 'i-ant-design:user-outlined',
    },
    children: [
      {
        path: '/member/user',
        meta: {
          title: '用户列表',
          icon: 'i-ant-design:team-outlined',
        },
      },
      {
        path: '/member/privilege',
        meta: {
          title: '会员权益',
          icon: 'i-ant-design:crown-outlined',
        },
      },
      {
        path: '/member/benefit',
        meta: {
          title: '会员礼遇',
          icon: 'i-ant-design:gift-outlined',
        },
      },
      {
        path: '/member/appointment',
        meta: {
          title: '预约管理',
          icon: 'i-ant-design:calendar-outlined',
        },
      },
    ],
  },
]

export default memberMenu
