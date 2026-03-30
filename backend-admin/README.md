# 奢侈品腕表小程序商城 - 后台管理前端

基于 [Fantastic-admin](https://fantastic-admin.gitee.io/) Vue3 版本的后台管理系统。

## 项目结构

```
backend-admin/
├── src/
│   ├── api/                    # API 接口模块
│   │   └── modules/
│   │       ├── admin.ts        # 管理员相关接口
│   │       └── app.ts          # 应用相关接口（菜单、路由）
│   ├── assets/                 # 静态资源
│   ├── components/             # 公共组件
│   ├── layouts/                # 布局组件
│   ├── router/                 # 路由配置
│   │   ├── guards.ts           # 路由守卫（核心鉴权逻辑）
│   │   └── routes.ts          # 路由定义
│   ├── store/                  # 状态管理
│   │   └── modules/
│   │       ├── user.ts         # 用户状态
│   │       ├── route.ts        # 路由状态（核心）
│   │       ├── menu.ts         # 菜单状态
│   │       └── settings.ts     # 设置状态
│   ├── utils/                  # 工具函数
│   └── views/                  # 页面组件
│       ├── home.vue            # 首页
│       ├── login.vue           # 登录页
│       └── system/             # 系统管理模块
│           ├── user/
│           │   └── index.vue   # 用户管理
│           ├── role/
│           │   └── index.vue   # 角色管理
│           └── menu/
│               └── index.vue   # 菜单管理
```

---

## 一、数据库设计

### 1.1 ER 关系图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   admin_user   │────▶│ admin_user_role │◀────│    sys_role     │
│   (管理员表)    │     │  (用户角色关联)  │     │    (角色表)     │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                              │
         │              ┌─────────────────┐            │
         └─────────────▶│   sys_role_menu │◀───────────┘
                        │ (角色菜单关联)  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    sys_menu     │
                        │   (菜单权限表)  │
                        └─────────────────┘
```

### 1.2 表结构详解

#### admin_user - 管理员用户表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| password | VARCHAR(100) | BCrypt 加密密码 |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像 URL |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| status | TINYINT | 状态：1正常，0禁用 |
| deleted | TINYINT | 逻辑删除：0未删除，1已删除 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

#### sys_role - 角色表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| role_name | VARCHAR(50) | 角色名称 |
| role_code | VARCHAR(50) | 角色编码（唯一标识） |
| description | VARCHAR(255) | 角色描述 |
| status | TINYINT | 状态：1正常，0禁用 |
| deleted | TINYINT | 逻辑删除 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

#### admin_user_role - 用户角色关联表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| user_id | BIGINT | 用户ID，外键 |
| role_id | BIGINT | 角色ID，外键 |
| create_time | DATETIME | 创建时间 |

#### sys_menu - 菜单权限表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| parent_id | BIGINT | 父菜单ID，0表示顶级 |
| name | VARCHAR(50) | 菜单名称 |
| path | VARCHAR(255) | 路由路径（以/开头） |
| component | VARCHAR(255) | 组件路径 |
| icon | VARCHAR(50) | 图标 |
| menu_type | TINYINT | 菜单类型：1目录，2菜单，3按钮 |
| sort | INT | 排序号 |
| permission | VARCHAR(100) | 权限标识（如 system:user:add） |
| status | TINYINT | 状态：1正常，0禁用 |
| deleted | TINYINT | 逻辑删除 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

#### sys_role_menu - 角色菜单关联表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| role_id | BIGINT | 角色ID |
| menu_id | BIGINT | 菜单ID |
| create_time | DATETIME | 创建时间 |

### 1.3 菜单类型说明

| menu_type 值 | 说明 | 示例 |
|--------------|------|------|
| 1 | 目录 | 系统管理、商品管理 |
| 2 | 菜单 | 用户管理、角色管理 |
| 3 | 按钮权限 | 新增、编辑、删除 |

---

## 二、核心登录流程

### 2.1 登录时序图

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  前端   │    │  API    │    │  后端   │    │ Sa-Token│    │  数据库  │
└────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │              │              │              │              │
     │ 1.登录请求   │              │              │              │
     │────────────▶│              │              │              │
     │              │ 2.调用接口   │              │              │
     │              │────────────▶│              │              │
     │              │              │ 3.查询用户   │              │
     │              │              │─────────────────────────▶│
     │              │              │              │              │
     │              │              │ 4.校验密码    │              │
     │              │              │   (BCrypt)   │              │
     │              │              │              │              │
     │              │              │ 5.Sa-Token登录│              │
     │              │              │─────────────▶│              │
     │              │              │ 6.返回Token   │              │
     │              │ 7.返回token  │◀─────────────│              │
     │◀─────────────│              │              │              │
     │              │              │              │              │
     │ 8.保存Token  │              │              │              │
     │ 触发路由生成  │              │              │              │
```

### 2.2 登录 API 接口

**请求**
```
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "xxxx-xxxx-xxxx",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "系统管理员",
      "avatar": "",
      "email": "admin@example.com",
      "roles": ["SUPER_ADMIN"]
    }
  }
}
```

---

## 三、菜单权限系统

### 3.1 权限校验流程

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  前端   │    │  后端   │    │  数据库  │    │ 路由导航 │
└────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
     │              │              │              │
     │ 1.获取菜单   │              │              │
     │────────────▶│              │              │
     │              │ 2.SQL查询    │              │
     │              │─────────────▶│              │
     │              │              │              │
     │              │ 3.构建菜单树  │              │
     │              │◀──────────────│              │
     │ 4.返回菜单树 │              │              │
     │◀─────────────│              │              │
     │              │              │              │
     │ 5.格式化路由  │              │              │
     │ 6.动态注册路由│              │              │
     │              │              │              │
     │ 7.渲染侧边栏  │              │              │
     │◀─────────────│              │              │
```

### 3.2 后端菜单 API

**接口**: `GET /admin/menus`

**响应格式**:
```json
{
  "code": 200,
  "data": [
    {
      "path": "/system",
      "component": "Layout",
      "meta": {
        "title": "系统管理",
        "icon": "Setting"
      },
      "children": [
        {
          "path": "/system/user",
          "component": "system/user/index",
          "meta": {
            "title": "用户管理",
            "icon": "User"
          }
        }
      ]
    }
  ]
}
```

---

## 四、核心代码详解

### 4.1 路由生成 (route.ts)

这是整个权限系统的核心文件，负责从后端获取菜单数据并转换为 Vue Router 可用的路由格式。

```typescript
import type { Route } from '#/global'
import type { RouteRecordRaw, RouterMatcher } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { createRouterMatcher } from 'vue-router'
import apiApp from '@/api/modules/app'

export const useRouteStore = defineStore(
  'route',
  () => {
    const isGenerate = ref(false)
    const routesRaw = ref<Route.recordMainRaw[]>([])

    // 格式化后端路由数据，转换为 Vue Router 格式
    function formatBackRoutes(
      routes: any,
      views = import.meta.glob('../../views/**/*.vue')
    ): Route.recordMainRaw[] {
      if (!routes || !Array.isArray(routes)) {
        return []
      }
      return routes.map((route: any) => {
        // 跳过无效路由
        if (!route || !route.path) return null

        // 处理 Layout 组件名称（兼容 LAYOUT 和 Layout）
        const componentStr = route.component
        if (componentStr?.toUpperCase() === 'LAYOUT' || componentStr === 'Layout') {
          route.component = () => import('@/layouts/index.vue')
        }
        else if (componentStr) {
          // 移除开头的斜杠，避免双斜杠路径
          const cleanPath = componentStr.startsWith('/')
            ? componentStr.substring(1)
            : componentStr
          let viewPath = `../../views/${cleanPath}`
          if (!viewPath.endsWith('.vue')) {
            viewPath = `${viewPath}.vue`
          }
          route.component = views[viewPath]
          if (!route.component) {
            delete route.component
          }
        }
        else {
          delete route.component
        }

        // 递归处理子路由
        if (route.children) {
          route.children = formatBackRoutes(route.children, views)
          route.children = route.children.filter((c: any) => c !== null)
        }
        return route
      }).filter((r: any) => r !== null)
    }

    // 生成路由（后端获取）
    async function generateRoutesAtBack() {
      await apiApp.routeList().then((res) => {
        // 1. 格式化路由数据
        routesRaw.value = formatBackRoutes(res.data) as any

        // 2. 展平路由（父路由 + 子路由都要注册）
        const flatRoutes: RouteRecordRaw[] = []

        function flattenRoutes(routes: any[], parentAuth?: string): RouteRecordRaw[] {
          routes.forEach((route: any) => {
            const auth = parentAuth || route?.meta?.auth
            if (auth && route.meta) {
              route.meta.auth = auth
            }
            if (route.children && route.children.length > 0) {
              // 有子路由：添加父路由 + 递归子路由
              flatRoutes.push(cloneDeep(route))
              flatRoutes.push(...flattenRoutes(route.children, auth))
            } else {
              // 无子路由：添加自身
              flatRoutes.push(cloneDeep(route))
            }
          })
          return flatRoutes
        }

        flatRoutes.push(...flattenRoutes(routesRaw.value))

        // 3. 创建路由匹配器
        routesMatcher.value = createRouterMatcher(flatRoutes, {})
        isGenerate.value = true
      })
    }

    return { isGenerate, routesRaw, generateRoutesAtBack }
  }
)
```

### 4.2 菜单状态管理 (menu.ts)

负责将路由数据转换为侧边栏菜单格式。

```typescript
import type { Menu, Route } from '#/global'
import type { RouteRecordRaw } from 'vue-router'
import { cloneDeep } from 'es-toolkit'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const routeStore = useRouteStore()
    const actived = ref(0)

    // 将原始路由转换成导航菜单
    function convertRouteToMenu(routes: Route.recordMainRaw[]): Menu.recordMainRaw[] {
      const returnMenus: Menu.recordMainRaw[] = []
      routes.forEach((item) => {
        // 确保 children 存在且有内容
        if (item.children && item.children.length > 0) {
          const menuItem: Menu.recordMainRaw = {
            meta: {
              title: item?.meta?.title,
              icon: item?.meta?.icon,
              auth: item?.meta?.auth,
            },
            children: [],
          }
          menuItem.children = convertRouteToMenuRecursive(item.children)
          returnMenus.push(menuItem)
        }
      })
      return returnMenus
    }

    // 递归转换子菜单
    function convertRouteToMenuRecursive(
      routes: RouteRecordRaw[],
      basePath = ''
    ): Menu.recordRaw[] {
      return routes.map((item) => {
        const menuItem: Menu.recordRaw = {
          path: resolveRoutePath(basePath, item.path),
          meta: {
            title: item?.meta?.title,
            icon: item?.meta?.icon,
            auth: item?.meta?.auth,
          },
        }
        if (item.children) {
          menuItem.children = convertRouteToMenuRecursive(item.children, menuItem.path)
        }
        return menuItem
      })
    }

    // 完整导航数据
    const allMenus = computed(() => {
      return convertRouteToMenu(routeStore.routesRaw)
    })

    return { allMenus }
  }
)
```

### 4.3 用户状态管理 (user.ts)

负责登录、登出、Token 管理。

```typescript
import apiAdmin from '@/api/modules/admin'
import router from '@/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref(localStorage.token ?? '')
    const isLogin = computed(() => !!token.value)

    // 登录
    async function login(data: { account: string; password: string }) {
      const res: any = await apiAdmin.login({
        username: data.account,
        password: data.password,
      })

      // 保存 token
      localStorage.setItem('token', res.data.token)
      token.value = res.data.token

      // 保存用户信息
      localStorage.setItem('nickname', res.data.userInfo.nickname || '')
    }

    // 登出
    function logout() {
      apiAdmin.logout().finally(() => {
        localStorage.removeItem('token')
        token.value = ''
        router.push({ name: 'login' })
      })
    }

    // 获取权限
    async function getPermissions() {
      const res: any = await apiAdmin.getPermission()
      permissions.value = res.data.permissions || []
    }

    return { token, isLogin, login, logout, getPermissions }
  }
)
```

### 4.4 后端登录控制器 (AdminController.java)

```java
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public R<LoginVO> login(@RequestBody LoginDTO dto) {
        // 1. 用户名密码校验
        AdminUser admin = adminUserService.login(dto.getUsername(), dto.getPassword());

        // 2. Sa-Token 登录
        StpUtil.login(admin.getId());

        // 3. 获取 Token
        String token = StpUtil.getTokenValue();

        // 4. 构建响应
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserInfo(buildUserInfo(admin));
        return R.success(vo);
    }

    /**
     * 获取用户菜单
     */
    @GetMapping("/menus")
    public R<List<Map<String, Object>>> getMenus() {
        Long userId = StpUtil.getLoginIdAsLong();
        List<Map<String, Object>> menus = sysMenuService.getUserMenus(userId);
        return R.success(menus);
    }

    /**
     * 登出
     */
    @PostMapping("/logout")
    public R<Void> logout() {
        StpUtil.logout();
        return R.success();
    }
}
```

### 4.5 后端菜单服务 (SysMenuServiceImpl.java)

```java
@Service
public class SysMenuServiceImpl implements SysMenuService {

    @Autowired
    private SysMenuMapper sysMenuMapper;

    @Override
    public List<Map<String, Object>> getUserMenus(Long userId) {
        // 1. 获取用户所有菜单
        List<SysMenu> allMenus = sysMenuMapper.selectByUserId(userId);
        if (allMenus.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. 过滤掉按钮权限（menu_type = 3）
        List<SysMenu> menuOnly = allMenus.stream()
            .filter(m -> m.getMenuType() == null || m.getMenuType() != 3)
            .collect(Collectors.toList());

        // 3. 构建菜单树
        return buildMenuTree(menuOnly);
    }

    /**
     * 构建菜单树
     */
    private List<Map<String, Object>> buildMenuTree(List<SysMenu> menus) {
        // 按 parentId 分组
        Map<Long, List<SysMenu>> groupByParent = menus.stream()
            .collect(Collectors.groupingBy(SysMenu::getParentId));

        // 获取顶级菜单
        List<SysMenu> rootMenus = groupByParent.getOrDefault(0L, Collections.emptyList());

        // 递归构建树
        return rootMenus.stream()
            .sorted(Comparator.comparingInt(m -> m.getSort() == null ? 0 : m.getSort()))
            .map(menu -> buildMenuNode(menu, groupByParent))
            .collect(Collectors.toList());
    }

    /**
     * 构建单个菜单节点
     */
    private Map<String, Object> buildMenuNode(
        SysMenu menu,
        Map<Long, List<SysMenu>> groupByParent
    ) {
        Map<String, Object> node = new LinkedHashMap<>();
        node.put("path", menu.getPath());

        // 构建 meta 信息
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("title", menu.getName());
        meta.put("icon", menu.getIcon());
        node.put("meta", meta);

        // 获取子菜单
        List<SysMenu> children = groupByParent.getOrDefault(menu.getId(), Collections.emptyList());

        if (!children.isEmpty()) {
            // 有子菜单
            List<Map<String, Object>> childNodes = children.stream()
                .sorted(Comparator.comparingInt(m -> m.getSort() == null ? 0 : m.getSort()))
                .map(child -> buildMenuNode(child, groupByParent))
                .collect(Collectors.toList());
            node.put("children", childNodes);

            // 目录类型设置 Layout 组件
            if (menu.getMenuType() != null && menu.getMenuType() == 1) {
                node.put("component", "Layout");
            } else if (StringUtils.hasText(menu.getComponent())) {
                node.put("component", menu.getComponent());
            }
        } else {
            // 没有子菜单
            if (menu.getMenuType() != null && menu.getMenuType() == 1) {
                node.put("component", "Layout");
            } else if (StringUtils.hasText(menu.getComponent())) {
                node.put("component", menu.getComponent());
            }
        }

        return node;
    }
}
```

### 4.6 Sa-Token 配置 (SaTokenConfig.java)

```java
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
            .addPathPatterns("/**")
            .excludePathPatterns(
                "/admin/login",      // 登录接口不拦截
                "/admin/captcha/**", // 验证码接口不拦截
                "/error",
                "/favicon.ico"
            );
    }
}
```

### 4.7 API 接口 (admin.ts)

```typescript
import api from '../index'

export default {
  // 登录
  login: (data: { username: string; password: string }) =>
    api.post('/admin/login', data),

  // 登出
  logout: () => api.post('/admin/logout'),

  // 获取用户信息
  getUserInfo: () => api.get('/admin/info'),

  // 获取权限列表
  getPermission: () => api.get('/admin/permission'),
}
```

---

## 五、路由守卫核心逻辑 (guards.ts)

```typescript
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const routeStore = useRouteStore()

  // 1. 已登录状态检查
  if (userStore.isLogin) {
    // 2. 检查路由是否已生成
    if (routeStore.isGenerate) {
      return true
    }

    // 3. 路由未生成，开始生成
    try {
      // 3.1 获取用户权限
      await userStore.getPermissions()

      // 3.2 根据配置选择路由生成模式
      if (settingsStore.settings.app.routeBaseOn === 'backend') {
        await routeStore.generateRoutesAtBack()
      }

      // 3.3 动态注册路由
      routeStore.routes.forEach((route) => {
        removeRoutes.push(router.addRoute(route))
      })

      // 3.4 重新进入当前路由
      return to.path
    } catch (error) {
      // 3.5 路由生成失败，登出
      userStore.logout()
    }
  }

  // 4. 未登录，跳转到登录页
  if (to.name !== 'login') {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }
})
```

---

## 六、常见错误及解决方案（重要）

### 6.1 登录后立即退出

**错误信息**:
```
TypeError: Cannot read properties of null (reading '0')
at createRouterMatcher (route.ts:131)
```

**原因分析**:
1. 后端返回的菜单数据包含 `menu_type = 3` 的按钮权限
2. 按钮权限的 `path` 字段为 `null`
3. 前端 `formatBackRoutes` 函数没有过滤掉无效路由
4. 导致 `createRouterMatcher` 接收到包含 `null` 的路由数组而崩溃

**解决方案**:
```java
// 后端 SysMenuServiceImpl.java - 过滤掉按钮权限
@Override
public List<Map<String, Object>> getUserMenus(Long userId) {
  List<SysMenu> allMenus = sysMenuMapper.selectByUserId(userId);
  if (allMenus.isEmpty()) {
    return new ArrayList<>();
  }

  // 过滤掉按钮权限（menu_type = 3）
  List<SysMenu> menuOnly = allMenus.stream()
    .filter(m -> m.getMenuType() == null || m.getMenuType() != 3)
    .collect(Collectors.toList());

  return buildMenuTree(menuOnly);
}
```

### 6.2 children undefined 错误

**错误信息**:
```
TypeError: Cannot read properties of undefined (reading 'length')
at convertRouteToMenu (menu.ts:22)
```

**原因分析**:
路由数据中的 `children` 字段可能是 `undefined` 而非空数组

**解决方案**:
```typescript
// 修复 menu.ts
routes.forEach((item) => {
  // 添加 children 检查
  if (item.children && item.children.length > 0) {
    // ...
  }
})
```

### 6.3 组件路径找不到 404

**错误信息**:
页面加载成功但内容区域空白，控制台显示 404

**原因分析**:
1. 数据库中 `component` 字段为 `/system/user/index`（以斜杠开头）
2. 前端拼接为 `../../views//system/user/index.vue`（双斜杠）
3. Vite glob 无法匹配

**解决方案**:
```typescript
// 移除开头的斜杠
const cleanPath = componentStr.startsWith('/')
  ? componentStr.substring(1)
  : componentStr
let viewPath = `../../views/${cleanPath}`
```

### 6.4 页面 404（父路由缺失）

**错误信息**:
访问 `/system/user` 页面 404

**原因分析**:
1. 只注册了子路由 `/system/user`
2. 父路由 `/system` 未注册
3. Vue Router 无法匹配嵌套路由

**解决方案**:
```typescript
// 展平路由时同时注册父路由和子路由
function flattenRoutes(routes: any[]): RouteRecordRaw[] {
  routes.forEach((route: any) => {
    if (route.children && route.children.length > 0) {
      // 有子路由：添加父路由
      flatRoutes.push(cloneDeep(route))
      // 递归添加子路由
      flatRoutes.push(...flattenRoutes(route.children))
    } else {
      // 无子路由：添加自身
      flatRoutes.push(cloneDeep(route))
    }
  })
  return flatRoutes
}
```

### 6.5 LAYOUT 大小写不匹配

**错误信息**:
Layout 组件未正确加载

**原因分析**:
数据库存储为 `LAYOUT`（大写），前端判断为 `Layout`（首字母大写）

**解决方案**:
```typescript
// 兼容处理大小写
if (componentStr?.toUpperCase() === 'LAYOUT' || componentStr === 'Layout') {
  route.component = () => import('@/layouts/index.vue')
}
```

---

## 七、数据库初始化 SQL

```sql
-- ===============================================
-- 1. 管理员用户表
-- ===============================================
CREATE TABLE IF NOT EXISTS `admin_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '密码',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常，0禁用',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- ===============================================
-- 2. 角色表
-- ===============================================
CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常，0禁用',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- ===============================================
-- 3. 用户角色关联表
-- ===============================================
CREATE TABLE IF NOT EXISTS `admin_user_role` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ===============================================
-- 4. 菜单权限表
-- ===============================================
CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `parent_id` BIGINT DEFAULT 0 COMMENT '父菜单ID',
  `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `path` VARCHAR(255) DEFAULT NULL COMMENT '路由路径',
  `component` VARCHAR(255) DEFAULT NULL COMMENT '组件路径',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
  `menu_type` TINYINT DEFAULT 2 COMMENT '菜单类型：1目录，2菜单，3按钮',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `permission` VARCHAR(100) DEFAULT NULL COMMENT '权限标识',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1正常，0禁用',
  `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单权限表';

-- ===============================================
-- 5. 角色菜单关联表
-- ===============================================
CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `role_id` BIGINT NOT NULL COMMENT '角色ID',
  `menu_id` BIGINT NOT NULL COMMENT '菜单ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- ===============================================
-- 6. 初始化数据
-- ===============================================

-- 插入超级管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `description`, `status`, `deleted`)
VALUES (1, '超级管理员', 'SUPER_ADMIN', '拥有所有权限', 1, 0);

-- 插入普通管理员角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `description`, `status`, `deleted`)
VALUES (2, '管理员', 'ADMIN', '普通管理员', 1, 0);

-- 插入管理员用户 (密码: admin123，需 BCrypt 加密)
INSERT INTO `admin_user` (`id`, `username`, `password`, `nickname`, `status`, `deleted`)
VALUES (1, 'admin', '$2a$10$xxx', '系统管理员', 1, 0);

-- 插入测试用户
INSERT INTO `admin_user` (`id`, `username`, `password`, `nickname`, `status`, `deleted`)
VALUES (2, 'test', '$2a$10$xxx', '测试管理员', 1, 0);

-- 关联用户和角色
INSERT INTO `admin_user_role` (`user_id`, `role_id`) VALUES (1, 1);
INSERT INTO `admin_user_role` (`user_id`, `role_id`) VALUES (2, 2);

-- ===============================================
-- 7. 初始化菜单数据
-- ===============================================

-- 首页
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (1, 0, '首页', '/home', 'home', 'HomeFilled', 2, 1, 1, 0);

-- 系统管理目录
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (2, 0, '系统管理', '/system', 'Layout', 'Setting', 1, 100, 1, 0);

-- 商品管理目录
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (3, 0, '商品管理', '/product', 'Layout', 'Goods', 1, 200, 1, 0);

-- 订单管理目录
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (4, 0, '订单管理', '/order', 'Layout', 'List', 1, 300, 1, 0);

-- 用户管理菜单
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (10, 2, '用户管理', '/system/user', 'system/user/index', 'User', 2, 1, 1, 0);

-- 角色管理菜单
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (11, 2, '角色管理', '/system/role', 'system/role/index', 'UserFilled', 2, 2, 1, 0);

-- 菜单管理菜单
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `sort`, `status`, `deleted`)
VALUES (12, 2, '菜单管理', '/system/menu', 'system/menu/index', 'Menu', 2, 3, 1, 0);

-- 关联角色和菜单
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 2);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 4);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (1, 12);

INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 1);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 2);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 3);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 4);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 10);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 11);
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`) VALUES (2, 12);
```

---

## 八、配置说明

### 7.1 环境变量 (.env.development)

```env
# API 基础地址
VITE_APP_API_BASEURL=http://localhost:8081

# 代理配置
VITE_OPEN_PROXY=false
```

### 7.2 路由模式配置 (settings.ts)

```typescript
export const settings: Settings.all = {
  app: {
    // 路由生成模式：frontend | backend | filesystem
    routeBaseOn: 'backend',
    enablePermission: true,
  },
  menu: {
    // 菜单生成模式：frontend | backend | filesystem
    baseOn: 'backend',
  },
}
```

### 7.3 代理配置 (vite.config.ts)

```typescript
server: {
  proxy: {
    '/admin': {
      target: 'http://localhost:8081',
      changeOrigin: true,
    },
  },
}
```

---

## 九、开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 代码检查
pnpm lint
```

---

## 十、测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 (SUPER_ADMIN) |
| test | admin123 | 管理员 (ADMIN) |

---

## 十一、关键文件索引

| 功能 | 文件路径 | 说明 |
|------|----------|------|
| 登录接口 | `src/api/modules/admin.ts` | 调用后端登录 API |
| 用户状态 | `src/store/modules/user.ts` | 管理登录状态、Token |
| 路由生成 | `src/store/modules/route.ts` | 核心：动态路由生成 |
| 菜单管理 | `src/store/modules/menu.ts` | 侧边栏菜单数据 |
| 路由守卫 | `src/router/guards.ts` | 鉴权、路由拦截 |
| 布局组件 | `src/layouts/index.vue` | 主布局（侧边栏+内容区） |
