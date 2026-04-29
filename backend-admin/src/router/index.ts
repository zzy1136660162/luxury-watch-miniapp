import { loadingFadeOut } from 'virtual:app-loading'
import { createRouter, createWebHashHistory } from 'vue-router'
import pinia from '@/store'
import setupExtensions from './extensions'
import setupGuards from './guards'
import { constantRoutes, mainRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes, ...mainRoutes],
})

setupGuards(router)
setupExtensions(router)

router.isReady().then(() => {
  loadingFadeOut()
})

export default router
