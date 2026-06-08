<script setup lang="ts">
import hotkeys from 'hotkeys-js'
import { useSlots } from '@/slots'
import Logo from '../Logo/index.vue'

defineOptions({
  name: 'MainSidebar',
})

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()
const route = useRoute()
const router = useRouter()

const { switchTo } = useMenu()

// 平台名称
const platformTitle = ref(import.meta.env.VITE_APP_TITLE || '管理平台')

// 折叠状态 - 监听 settingsStore 的状态
const isCollapse = computed(() => {
  return settingsStore.settings.menu.mainSidebarCollapse ?? false
})

// 展开的菜单索引
const expandedIndex = ref<number | null>(null)

// 切换菜单展开/收起
const toggleMenu = (index: number) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null
  } else {
    expandedIndex.value = index
  }
}

// 点击子菜单项
const handleSubMenuClick = (parentIndex: number, child: any) => {
  menuStore.setActived(parentIndex)
  router.push(child.path)
}

// 切换主侧边栏折叠状态
const toggleMainSidebarCollapse = () => {
  settingsStore.toggleMainSidebarCollapse()
}

// 检查当前路由是否匹配某个子菜单
const isChildActive = (child: any) => {
  // 使用精确匹配，避免 /product/list 匹配到 /order/list
  return route.path === child.path
}

// 检查当前路由是否在某个父菜单下
const isParentActive = (parentIndex: number) => {
  const parent = menuStore.allMenus[parentIndex]
  if (!parent?.children) return false
  // 检查当前路由是否以该父菜单的路径开头
  const parentPath = parent.path
  if (parentPath && route.path.startsWith(parentPath + '/')) {
    return true
  }
  return false
}

onMounted(() => {
  hotkeys('alt+`', (e) => {
    if (settingsStore.settings.menu.enableHotkeys && ['side', 'head'].includes(settingsStore.settings.menu.mode)) {
      e.preventDefault()
      switchTo(menuStore.actived + 1 < menuStore.allMenus.length ? menuStore.actived + 1 : 0)
    }
  })
  hotkeys('alt+shift+`', (e) => {
    if (settingsStore.settings.menu.enableHotkeys && ['side', 'head'].includes(settingsStore.settings.menu.mode)) {
      e.preventDefault()
      switchTo(menuStore.actived - 1 >= 0 ? menuStore.actived - 1 : menuStore.allMenus.length - 1)
    }
  })
})
onUnmounted(() => {
  hotkeys.unbind('alt+`')
  hotkeys.unbind('alt+shift+`')
})
</script>

<template>
  <Transition name="main-sidebar">
    <div
      v-if="settingsStore.settings.menu.mode === 'side' || (settingsStore.mode === 'mobile' && settingsStore.settings.menu.mode !== 'single')"
      class="main-sidebar-container"
      :class="{ 'is-collapse': isCollapse }"
    >
      <component :is="useSlots('main-sidebar-top')" />

      <!-- Logo 和平台名称区域 -->
      <div class="sidebar-header">
        <Logo :show-title="false" class="sidebar-logo" />
        <div v-if="!isCollapse" class="sidebar-title">
          <span class="platform-name">{{ platformTitle }}</span>
        </div>
      </div>

      <component :is="useSlots('main-sidebar-after-logo')" />
      <!-- 折叠按钮 -->
      <div v-if="settingsStore.mode === 'pc' && !isCollapse" class="collapse-button">
        <FaButton
          variant="secondary"
          size="icon"
          class="h-8 w-8 transition bg-white"
          @click="toggleMainSidebarCollapse"
        >
          <FaIcon name="toolbar-collapse" class="size-4" />
        </FaButton>
      </div>

      <!-- 折叠状态下显示的展开按钮 -->
      <div v-if="settingsStore.mode === 'pc' && isCollapse" class="expand-button">
        <FaButton
          variant="secondary"
          size="icon"
          class="h-8 w-8 transition bg-white"
          @click="toggleMainSidebarCollapse"
        >
          <FaIcon name="toolbar-collapse" class="size-4 rotate-180" />
        </FaButton>
      </div>

      <FaScrollArea :scrollbar="false" mask gradient-color="var(--g-main-sidebar-bg)" class="menu flex-1 overscroll-contain">
        <!-- 侧边栏模式（含主导航） -->
        <div class="w-full flex flex-col of-hidden py-1 transition-all -mt-2">
          <template v-for="(item, index) in menuStore.allMenus" :key="index">
            <div
              class="menu-item relative px-2 py-1 transition-all" :class="{
                active: isParentActive(index),
              }"
            >
              <!-- 有子菜单的情况 -->
              <template v-if="item.children && item.children.length !== 0">
                <!-- 父菜单项 -->
                <div
                  class="group menu-item-container relative h-full w-full flex cursor-pointer items-center justify-start rounded-lg py-4 text-[var(--g-main-sidebar-menu-color)] transition-colors hover-(bg-[var(--g-main-sidebar-menu-hover-bg)] text-[var(--g-main-sidebar-menu-hover-color)]) px-2!"
                  :class="{
                    'text-[var(--g-main-sidebar-menu-active-color)]! bg-[var(--g-main-sidebar-menu-active-bg)]!': isParentActive(index),
                  }"
                  :title="typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title"
                  @click="toggleMenu(index)"
                >
                  <span class="truncate text-center text-sm">
                    {{ typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title }}
                  </span>
                  <!-- 展开/收起箭头 -->
                  <FaIcon
                    name="i-ep:arrow-down"
                    class="absolute right-2 text-xs transition-transform"
                    :class="{ 'rotate-180': expandedIndex === index }"
                  />
                </div>
                <!-- 子菜单 -->
                <Transition name="sub-menu">
                  <div v-show="expandedIndex === index" class="sub-menu-list mt-1 ml-2 pl-2 border-l border-[var(--g-main-sidebar-menu-hover-bg)]">
                    <div
                      v-for="(child, childIndex) in item.children.filter((c: any) => c.meta?.menu !== false)"
                      :key="childIndex"
                      class="sub-menu-item py-2 px-3 text-xs text-[var(--g-main-sidebar-menu-color)] cursor-pointer rounded transition-colors hover-(bg-[var(--g-main-sidebar-menu-hover-bg)] text-[var(--g-main-sidebar-menu-hover-color)])"
                      :class="{
                        'text-[var(--g-main-sidebar-menu-active-color)]! bg-[var(--g-main-sidebar-menu-active-bg)]!': isChildActive(child)
                      }"
                      @click="handleSubMenuClick(index, child)"
                    >
                      <span class="truncate">{{ typeof child.meta?.title === 'function' ? child.meta?.title() : child.meta?.title }}</span>
                    </div>
                  </div>
                </Transition>
              </template>
              <!-- 没有子菜单的情况 -->
              <div
                v-else
                class="group menu-item-container relative h-full w-full flex cursor-pointer items-center justify-start rounded-lg py-4 text-[var(--g-main-sidebar-menu-color)] transition-colors hover-(bg-[var(--g-main-sidebar-menu-hover-bg)] text-[var(--g-main-sidebar-menu-hover-color)]) px-2!"
                :class="{
                  'text-[var(--g-main-sidebar-menu-active-color)]! bg-[var(--g-main-sidebar-menu-active-bg)]!': index === menuStore.actived,
                }"
                :title="typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title"
                @click="switchTo(index)"
              >
                <span class="truncate text-left text-sm">
                  {{ typeof item.meta?.title === 'function' ? item.meta?.title() : item.meta?.title }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </FaScrollArea>

      <component :is="useSlots('main-sidebar-after-menu')" />

      <div class="account-section">
        <div class="account-button-wrapper">
          <AccountButton
            :only-avatar="isCollapse"
            :button-variant="settingsStore.settings.menu.mode === 'side' ? 'secondary' : 'ghost'"
            class="account-btn"
          />
        </div>
      </div>

      <component :is="useSlots('main-sidebar-bottom')" />
    </div>
  </Transition>
</template>

<style scoped>
.main-sidebar-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: var(--g-main-sidebar-width);
  color: var(--g-main-sidebar-menu-color);
  background-color: var(--g-main-sidebar-bg);
  box-shadow: 1px 0 0 0 hsl(var(--border)), -1px 0 0 0 hsl(var(--border));
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, width 0.3s;

  &.is-collapse {
    width: var(--g-main-sidebar-collapse-width);

    .sidebar-header {
      .sidebar-title {
        display: none;
      }
    }

    /* 折叠状态下隐藏菜单和子菜单 */
    .menu {
      display: none !important;
    }

    :deep(.menu-item-container) {
      background-color: transparent !important;
    }

    /* 折叠状态下隐藏子菜单 */
    .sub-menu-list {
      display: none !important;
    }
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    height: var(--g-sidebar-logo-height);
    background-color: var(--g-main-sidebar-bg);

    .sidebar-logo {
      flex-shrink: 0;
      background-color: transparent;
    }

    .sidebar-title {
      flex: 1;
      min-width: 0;

      .platform-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--g-main-sidebar-menu-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .menu {
    :deep(.menu-item) {
      .menu-item-container {
        padding-block: 8px;
        color: var(--g-main-sidebar-menu-color);

        &:hover {
          color: var(--g-main-sidebar-menu-hover-color);
          background-color: var(--g-main-sidebar-menu-hover-bg);
        }

        .menu-item-container-icon {
          font-size: 20px !important;
        }
      }

      &.active .menu-item-container {
        color: var(--g-main-sidebar-menu-active-color) !important;
        background-color: var(--g-main-sidebar-menu-active-bg) !important;
      }
    }
  }

  .collapse-button {
    /* position: absolute; */
    /* top: 70%; */
    margin: 1vh 0 0 85%;
    transform: translateY(-50%);
    z-index: 10;
    width: 32px;
    transition: opacity 0.3s;
  }

  .expand-button {
    /* position: absolute; */
    /* top: 70%; */
    margin: 1vh 0 0 33%;
    right: 15px;
    transform: translateY(-50%);
    z-index: 10;
    width: 32px;
  }

  /* 子菜单样式 */
  .sub-menu-list {
    overflow: hidden;
  }

  .sub-menu-item {
    &:hover {
      color: var(--g-main-sidebar-menu-hover-color);
      background-color: var(--g-main-sidebar-menu-hover-bg);
    }
  }

  /* 账户区域样式 */
  .account-section {
    display: flex;
    align-items: center;
    padding: 12px 8px;
    border-top: 1px solid var(--el-border-color-lighter);
    margin-top: auto;
  }

  .account-button-wrapper {
    width: 100%;

    :deep(.account-btn) {
      width: 100%;

      > div {
        width: 100%;
      }
    }
  }
}

/* 主侧边栏动画 */
.main-sidebar-enter-active,
.main-sidebar-leave-active {
  transition: 0.3s;
}

.main-sidebar-enter-from,
.main-sidebar-leave-to {
  transform: translateX(calc(var(--g-main-sidebar-width) * -1));
}

/* 子菜单展开动画 */
.sub-menu-enter-active,
.sub-menu-leave-active {
  transition: all 0.3s ease;
}

.sub-menu-enter-from,
.sub-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
