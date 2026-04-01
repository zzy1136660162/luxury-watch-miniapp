# 小程序后端API集成说明

## 功能概述

小程序已成功集成后端API，实现从后端获取商品数据、分类数据、图片等，所有图片会自动拼接配置的服务器前缀进行显示。

## 实现内容

### 1. 后端API控制器

**文件位置：** `backend-java/src/main/java/com/luxurywatch/controller/MiniAppController.java`

**提供的API接口：**

| 接口 | 方法 | 说明 | 参数 |
|------|------|------|------|
| `/api/product/online/list` | GET | 获取上架商品列表 | page, size, category |
| `/api/product/featured` | GET | 获取精选商品 | 无 |
| `/api/product/{id}` | GET | 获取商品详情 | id |
| `/api/home/data` | GET | 获取首页数据 | 无 |
| `/api/home/new-arrivals` | GET | 获取新品推荐 | 无 |
| `/api/home/featured-collections` | GET | 获取热门系列 | 无 |
| `/api/collection/list` | GET | 获取所有分类 | 无 |
| `/api/collection/{category}` | GET | 获取指定分类商品 | category, page, size |

**响应格式：**
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    // 根据不同接口返回不同数据
  }
}
```

### 2. 小程序请求工具

**文件位置：** `miniprogram/utils/request.ts`

**提供的API方法：**

#### productApi - 商品相关
```typescript
// 获取商品列表
productApi.getList(params?: { page?, size?, category? })

// 获取商品详情
productApi.getDetail(id: number)

// 获取上架商品列表
productApi.getOnlineList(params?: { page?, size?, category? })

// 获取精选商品
productApi.getFeatured()
```

#### homeApi - 首页相关
```typescript
// 获取首页数据
homeApi.getHomeData()

// 获取新品推荐
homeApi.getNewArrivals()

// 获取热门系列
homeApi.getFeaturedCollections()
```

#### collectionApi - 系列相关
```typescript
// 获取所有系列
collectionApi.getAllCollections()

// 获取指定系列商品
collectionApi.getByCollection(collection: string, params?: { page?, size? })
```

### 3. 图片配置

**文件位置：** `miniprogram/utils/config.ts`

**配置：**
```typescript
const imageConfig = {
  baseUrl: 'http://localhost:8081',  // 图片服务器地址
  imagePath: '/images',
};
```

**使用方式：**
```typescript
import { getFullImageUrl } from '../../utils/config';

// 自动拼接完整图片URL
const fullUrl = getFullImageUrl('/images/2026-03/1774941078635_68fb2686.jpg');
// 结果: http://localhost:8081/images/2026-03/1774941078635_68fb2686.jpg
```

## 已修改的页面

### 1. 首页（home）

**文件：**
- `pages/home/home.ts`
- `pages/home/home.wxml`

**功能：**
- 从后端API获取首页数据
- 显示新品推荐、热门系列、精选商品
- 下拉刷新功能
- 自动处理图片URL

### 2. 系列页面（collections）

**文件：**
- `pages/collections/collections.ts`
- `pages/collections/collections.wxml`

**功能：**
- 从后端API获取分类列表
- 从后端API获取商品列表
- 支持分类筛选
- 分页加载
- 下拉刷新

### 3. 产品详情页（product-detail）

**文件：**
- `pages/product-detail/product-detail.ts`
- `pages/product-detail/product-detail.wxml`

**功能：**
- 从后端API获取商品详情
- 显示商品图片、价格、描述等信息
- 自动处理图片URL
- 下拉刷新

## 使用说明

### 1. 启动后端服务

修改完成后，需要重启后端服务以加载新的API控制器：

```bash
cd backend-java
mvn spring-boot:run
```

或者运行jar包：
```bash
java -jar target/luxury-watch-backend-0.0.1-SNAPSHOT.jar
```

### 2. 配置数据库

确保数据库中已有商品和分类数据：
- `product` 表：商品数据
- `product_category` 表：分类数据

### 3. 上传商品图片

1. 在后台管理系统中上传商品图片
2. 图片会存储在服务器本地：`D:/项目图标/年月/文件名`
3. 数据库中只存储相对路径：`/images/年月/文件名`
4. 小程序会自动拼接完整URL访问图片

### 4. 配置图片服务器

如果需要修改图片服务器地址，编辑：
- `miniprogram/utils/config.ts`（小程序端）
- `backend-java/src/main/resources/application.yml`（后端）

## 注意事项

### 1. 网络权限

确保在小程序的 `app.json` 中配置了 `permission`：

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于查找附近门店"
    }
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  }
}
```

### 2. 域名配置

在微信公众平台配置合法域名：
- 登录微信公众平台
- 进入「开发」→「开发设置」
- 在「服务器域名」中添加：
  - `request` 合法域名：`http://localhost:8081`
  - `downloadFile` 合法域名：`http://localhost:8081`

### 3. 开发环境

在微信开发者工具中，勾选「设置 → 项目设置 → 不校验合法域名」（仅限开发阶段）。

### 4. CORS配置

后端API已添加 `@CrossOrigin` 注解支持跨域访问。

## 常见问题

### Q: 小程序无法访问API怎么办？

**A:** 检查以下几点：
1. 确认后端服务已启动并运行在8081端口
2. 确认数据库连接正常
3. 检查微信开发者工具控制台错误信息
4. 确认已勾选"不校验合法域名"（开发阶段）

### Q: 图片无法显示怎么办？

**A:** 检查以下几点：
1. 确认后端服务已启动
2. 确认图片已上传到服务器（`D:/项目图标/`目录）
3. 检查图片路径是否正确
4. 确认数据库中存储的图片路径格式正确

### Q: 如何区分开发环境和生产环境？

**A:** 可以通过以下方式处理：
```typescript
// miniprogram/utils/config.ts
const isDev = process.env.NODE_ENV === 'development';

const imageConfig = {
  baseUrl: isDev ? 'http://localhost:8081' : 'https://your-production-server.com',
  imagePath: '/images',
};
```

### Q: API返回的数据结构是什么样的？

**A:** 商品数据结构：
```json
{
  "id": 1,
  "name": "曜石金·自动机械",
  "code": "Ref. 8820-A",
  "category": "经典",
  "image": "/images/2026-03/1774941078635_68fb2686.jpg",
  "images": "[\"/images/2026-03/xxx1.jpg\", \"/images/2026-03/xxx2.jpg\"]",
  "price": 298000.00,
  "stock": 100,
  "sales": 50,
  "status": 1,
  "description": "商品描述...",
  "content": "商品详情..."
}
```

## 后续优化

### 1. 分类数据支持

确保 `product_category` 表有以下字段：
- `id`：分类ID
- `name`：分类名称
- `name_en`：英文名称
- `description`：分类描述
- `image`：分类图片
- `sort`：排序
- `status`：状态

### 2. 图片多图支持

如果商品有多张图片，将图片URL以JSON格式存储在 `images` 字段中：
```json
["/images/2026-03/xxx1.jpg", "/images/2026-03/xxx2.jpg", "/images/2026-03/xxx3.jpg"]
```

### 3. 用户认证

如果需要用户登录功能，可以在请求中添加Token：
```typescript
const request = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    wx.request({
      // ...
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') || '',
        ...options.header
      }
    });
  });
};
```

## 技术支持

如遇到问题，请检查：

1. 后端服务是否正常运行
2. 数据库连接是否正常
3. 图片文件是否存在
4. 网络连接是否正常
5. 微信开发者工具控制台错误信息

---

**文档版本：** 1.0
**创建日期：** 2026-03-31
**最后更新：** 2026-03-31
