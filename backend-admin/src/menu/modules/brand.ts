import type { Menu } from '#/global'

const brandMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '品牌管理',
      icon: 'i-ant-design:flag-outlined',
    },
    children: [
      {
        path: '/brand/milestone',
        meta: {
          title: '历史里程碑',
          icon: 'i-ant-design:history-outlined',
        },
      },
      {
        path: '/brand/craft',
        meta: {
          title: '工艺展示',
          icon: 'i-ant-design:tool-outlined',
        },
      },
      {
        path: '/brand/news',
        meta: {
          title: '品牌资讯',
          icon: 'i-ant-design:read-outlined',
        },
      },
    ],
  },
]

export default brandMenu
