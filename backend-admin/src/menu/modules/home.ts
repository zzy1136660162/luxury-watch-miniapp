import type { Menu } from '#/global'

const homeMenu: Menu.recordMainRaw[] = [
  {
    meta: {
      title: '首页配置',
      icon: 'i-ant-design:home-outlined',
    },
    children: [
      {
        path: '/home/banner',
        meta: {
          title: '轮播图管理',
          icon: 'i-ant-design:picture-outlined',
        },
      },
      {
        path: '/home/recommend',
        meta: {
          title: '推荐管理',
          icon: 'i-ant-design:star-outlined',
        },
      },
      {
        path: '/home/search',
        meta: {
          title: '热门搜索',
          icon: 'i-ant-design:fire-outlined',
        },
      },
    ],
  },
]

export default homeMenu
