import type { RouteRecordRaw } from 'vue-router'

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        name: 'product-list',
        component: () => import('@/views/product/list/index.vue'),
        meta: {
          title: '商品列表',
          icon: 'i-ant-design:unordered-list-outlined',
          breadcrumb: false,
        },
      },
      {
        path: 'store',
        name: 'store',
        component: () => import('@/views/member/store/index.vue'),
        meta: {
          title: '门店管理',
          icon: 'i-ant-design:shop-twotone',
        },
      },
      {
        path: 'appointment',
        name: 'appointment',
        component: () => import('@/views/member/appointment/index.vue'),
        meta: {
          title: '预约管理',
          icon: 'i-ant-design:calendar-outlined',
        },
      },
      {
        path: 'product/list',
        name: 'product-list-page',
        component: () => import('@/views/product/list/index.vue'),
        meta: {
          title: '商品列表',
          icon: 'i-ant-design:unordered-list-outlined',
        },
      },
      {
        path: 'product/category',
        name: 'product-category',
        component: () => import('@/views/product/category/index.vue'),
        meta: {
          title: '商品分类',
          icon: 'i-ant-design:appstore-outlined',
        },
      },
      {
        path: 'product/brand',
        name: 'product-brand',
        component: () => import('@/views/product/brand/index.vue'),
        meta: {
          title: '品牌管理',
          icon: 'i-ant-design: Trademark-circle-outlined',
        },
      },
      {
        path: 'product/series',
        name: 'product-series',
        component: () => import('@/views/product/series/index.vue'),
        meta: {
          title: '系列管理',
          icon: 'i-ant-design: appstore-twotone',
        },
      },
      {
        path: 'exchange',
        name: 'exchange',
        component: () => import('@/views/exchange/index.vue'),
        meta: {
          title: '兑换管理',
          icon: 'i-ant-design:gift-outlined',
        },
      },
      {
        path: 'system/user',
        name: 'system-user',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-ant-design:team-outlined',
        },
      },
      {
        path: 'system/admin',
        name: 'system-admin',
        component: () => import('@/views/system/admin/index.vue'),
        meta: {
          title: '管理员管理',
          icon: 'i-ant-design:user-outlined',
        },
      },
      {
        path: 'system/menu',
        name: 'system-menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'i-ant-design:menu-twotone',
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载',
          breadcrumb: false,
        },
      },
    ],
  },
]

const asyncRoutes: Route.recordMainRaw[] = []

const constantRoutesByFilesystem: RouteRecordRaw[] = []

const asyncRoutesByFilesystem: RouteRecordRaw[] = []

export {
  asyncRoutes,
  asyncRoutesByFilesystem,
  constantRoutes,
  constantRoutesByFilesystem,
  mainRoutes,
}
