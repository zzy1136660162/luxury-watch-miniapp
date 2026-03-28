# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

奢侈品腕表小程序商城 - A luxury watch e-commerce platform with three modules:
- `backend-java/` - Spring Boot REST API (后端服务)
- `backend-admin/` - Vue 3 admin panel (基于 Fantastic-admin)
- `frontend-weapp/` - WeChat mini-program (微信小程序商城)

---

## Commands

### backend-java (Spring Boot)
```bash
cd backend-java

# 编译
mvn clean compile

# 运行开发服务器
mvn spring-boot:run

# 打包
mvn clean package -DskipTests
java -jar target/luxury-watch-backend-0.0.1-SNAPSHOT.jar
```

### backend-admin (Vue 3)
```bash
cd backend-admin

pnpm install
pnpm dev          # 开发模式 (http://localhost:9000)
pnpm build        # 生产构建
pnpm build:test   # 测试构建
pnpm lint         # 代码检查
```

### frontend-weapp (微信小程序)
使用微信开发者工具打开项目，配置 AppID: `wxc4b6fb48ec3afa8b`

---

## Architecture

### 后端分层架构 (backend-java)
```
Controller → Service → Mapper → MySQL
```
- 使用 MyBatis-Plus 进行数据库操作
- 使用 Sa-Token + JWT 进行权限认证
- 统一响应格式: `{code, msg, data}`
- 支持逻辑删除 (deleted 字段)

### 前端架构 (backend-admin)
基于 Fantastic-admin 框架，使用后端动态路由：
- `settings.ts` 中配置 `routeBaseOn: 'backend'` 从后端获取路由
- 菜单数据通过 `/admin/menus` 接口获取
- 权限校验通过 `useAuth()` composable

---

## 后端配置

### 端口与数据库
- 端口: 8081
- 数据库: MySQL (101.126.90.255:63306/luxury-watch-db)
- 用户: root

### Sa-Token 权限配置
- Token 名称: `Authorization`
- Token 有效期: 86400秒 (24小时)
- 活跃超时: 1800秒 (30分钟无操作)
- JWT 模式，支持无状态认证

### RBAC 权限体系

#### 核心表结构
| 表名 | 说明 |
|------|------|
| `admin_user` | 管理员用户表 |
| `sys_role` | 角色表 |
| `admin_user_role` | 用户角色关联表 |
| `sys_menu` | 菜单权限表 |
| `sys_role_menu` | 角色菜单关联表 |

#### 菜单类型 (menu_type)
| 值 | 说明 |
|----|------|
| 1 | 目录 (如系统管理) |
| 2 | 菜单 (如用户管理) |
| 3 | 按钮权限 (如新增、编辑、删除) |

#### 权限标识格式
```
system:user:list      # 查看用户
system:user:add       # 新增用户
system:user:edit      # 编辑用户
system:user:delete    # 删除用户
```

#### 测试账号
| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 超级管理员 (SUPER_ADMIN) |
| test | admin123 | 普通管理员 (ADMIN) |

#### 数据库初始化
首次启动后端时，`DatabaseInitializer` 会自动：
1. 检测 `admin_user` 表是否为空
2. 如果为空，自动创建表并插入初始数据
3. 包括角色、用户、菜单和权限关联

---

## API 规范

### 统一响应格式
```json
{"code": 200, "msg": "success", "data": {...}}
```

### 分页响应
```json
{"code": 200, "msg": "success", "data": {"total": 100, "list": [...]}}
```

### 认证接口 (/admin)
| 接口 | 方法 | 说明 | 需认证 |
|------|------|------|--------|
| `/admin/login` | POST | 登录 | 否 |
| `/admin/logout` | POST | 登出 | 是 |
| `/admin/info` | GET | 获取用户信息 | 是 |
| `/admin/permission` | GET | 获取权限列表 | 是 |
| `/admin/menus` | GET | 获取菜单树 | 是 |

### 登录请求/响应
```json
// 请求
POST /admin/login
{"username": "admin", "password": "admin123"}

// 响应
{
  "code": 200,
  "data": {
    "token": "xxx-xxx-xxx",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "系统管理员",
      "roles": ["SUPER_ADMIN"]
    }
  }
}
```

---

## 前端开发注意事项

### 代理配置
`vite.config.ts` 中配置了 `/admin` 路径代理到后端 8081 端口：
```typescript
proxy: {
  '/admin': {
    target: 'http://localhost:8081',
    changeOrigin: true,
  },
}
```

### 路由模式
- 当前配置为后端模式 (`routeBaseOn: 'backend'`)
- 菜单从 `/admin/menus` 接口获取
- 无需手动创建 Vue 文件对应菜单

### 权限校验
```typescript
// 在组件中使用
const { auth } = useAuth()
v-if="auth('system:user:add')"

// 使用指令
<button v-auth="'system:user:delete'">删除</button>
```

---

## 数据库配置

MySQL 连接信息在 `backend-java/src/main/resources/application.yml`:
- Host: 101.126.90.255
- Port: 63306
- Database: luxury-watch-db
- 用户: root
- 密码: Gesoft9919.

---

## 重要文件位置

### 后端
- `config/SaTokenConfig.java` - Sa-Token 核心配置
- `config/SaPermissionImpl.java` - 权限认证实现
- `config/DatabaseInitializer.java` - 数据库自动初始化
- `controller/AdminController.java` - 管理员接口

### 前端
- `settings.ts` - 应用配置（路由模式、权限开关）
- `store/modules/user.ts` - 用户状态管理
- `api/modules/admin.ts` - 管理员 API
- `utils/composables/useAuth.ts` - 权限校验 composable
