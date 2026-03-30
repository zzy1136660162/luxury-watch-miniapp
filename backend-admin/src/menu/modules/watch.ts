import type { Menu } from '#/global'

const watchMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '腕表管理',
      icon: 'i-ant-design:watch-outlined',
    },
    children: [
      {
        path: '/watch/list',
        meta: {
          title: '腕表列表',
          icon: 'i-ant-design:unordered-list-outlined',
        },
      },
      {
        path: '/watch/series',
        meta: {
          title: '系列管理',
          icon: 'i-ant-design:appstore-outlined',
        },
      },
    ],
  },
]

export default watchMenu
