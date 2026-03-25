# CHRONOS 腕表小程序开发说明

## 项目概述

本项目基于 **Chronos Heritage** 设计系统（"The Timeless Monolith"）开发的高奢腕表微信小程序界面，完全还原了 Stitch 设计作品的视觉效果和交互逻辑。

## 设计系统

### 核心理念
**"The Digital Curator"** - 数字策展人

设计特点：
- **Intentional Asymmetry** (刻意的不对称)
- **Editorial Breathing Room** (编辑级留白)
- **High-contrast Print-on-Silk** (高对比度的丝印效果)

### 配色方案

#### 主色系
- **Primary**: #000000 - 核心品牌色
- **Primary Container**: #1A1A1A - 深炭灰
- **On Primary**: #ffffff - 白色文字

#### 强调色
- **Champagne Gold**: #D4AF37 - 香槟金
- **Metallic Silver**: #C0C0C0 - 金属银

#### 表面色
- **Surface**: #f9f9f9 - 浅灰背景
- **Surface Container**: #eeeeee - 卡片背景
- **Surface Container Lowest**: #ffffff - 纯白卡片

### 字体系统
- **中文**: Noto Serif SC - 用于标题和主要信息
- **英文**: Manrope - 用于正文和技术描述

### 设计原则
- ✅ 0px 圆角（无圆角设计）
- ✅ 无分隔线，使用间距分隔
- ✅ 大量垂直留白
- ✅ 中英双语排版
- ✅ 玻璃拟态导航栏

---

## 已开发的页面

### 1. 品牌首页 (Home Page)
**路径**: `pages/home/home`

**功能**:
- Hero 大幅横幅展示
- 新品推荐（2款产品卡片）
- 品牌故事介绍
- 热门系列横向滚动展示
- 尊享顾问服务入口
- 底部导航栏

**交互逻辑**:
- 点击产品卡片 → 跳转腕表详情页
- 点击系列卡片 → 跳转腕表系列页
- 点击"EXPLORE HERITAGE" → 跳转品牌馆
- 点击"联系顾问" → 显示顾问服务对话框
- 底部导航 → 切换不同功能区

---

### 2. 腕表详情 (Product Detail Page)
**路径**: `pages/product-detail/product-detail`

**功能**:
- 多图轮播展示
- 产品标题和系列信息
- 产品亮点展示（3个特性）
- 详细规格参数
- 设计灵感介绍
- 固定底部操作栏

**交互逻辑**:
- 图片轮播切换
- 点击"Explore Our Heritage" → 跳转品牌馆
- 点击"咨询顾问" → 显示咨询对话框
- 点击"预约到店" → 显示预约对话框
- 支持页面分享

**页面参数**:
- `id`: 产品ID（可选）

---

### 3. 腕表系列 (Collections Page)
**路径**: `pages/collections/collections`

**功能**:
- Hero 大幅横幅
- 分类筛选导航（经典/运动/复杂功能/女士）
- 精选系列网格布局
- 产品列表展示（错落布局）

**交互逻辑**:
- 点击分类标签 → 切换筛选状态
- 点击产品卡片 → 跳转腕表详情页
- 底部导航 → 切换不同功能区

**页面参数**:
- `collection`: 系列类型（可选）

---

## 全局样式

### 设计系统变量
**路径**: `styles/design-system.scss`

包含所有设计系统变量：
- 颜色变量（$primary, $tertiary 等）
- 字体变量（$font-family-chinese, $font-family-english）
- 间距变量（$spacing-xs 到 $spacing-3xl）
- 圆角变量（$border-radius: 0px）
- 阴影变量（$shadow-ambient）
- Z-Index 层级变量

### 使用方式
```scss
@import '/styles/design-system.scss';

.my-component {
  background-color: $primary;
  color: $on-primary;
  font-family: $font-family-chinese;
  padding: $spacing-md;
  border-radius: $border-radius;
}
```

---

## 导航结构

### 页面路由
```
pages/home/home              - 品牌首页（默认）
pages/collections/collections - 腕表系列
pages/product-detail/product-detail - 腕表详情
pages/heritage/heritage      - 品牌馆（待开发）
pages/member/member          - 会员中心（待开发）
pages/privileges/privileges  - 会员礼遇（待开发）
```

### 页面跳转方式
```typescript
// 跳转新页面
wx.navigateTo({
  url: '/pages/product-detail/product-detail?id=123'
});

// 切换 Tab
wx.switchTab({
  url: '/pages/collections/collections'
});

// 返回上一页
wx.navigateBack();
```

---

## 组件说明

### Navigation Bar 组件
**路径**: `components/navigation-bar/`

**功能**:
- 自定义顶部导航栏
- 适配 iOS/Android 平台
- 支持返回按钮
- 支持菜单按钮
- 玻璃拟态效果

**使用方法**:
```xml
<navigation-bar 
  title="CHRONOS" 
  back="{{true}}" 
  color="black" 
  background="#ffffff"
  showMenu="{{true}}"
/>
```

**属性**:
- `title`: 导航标题
- `back`: 是否显示返回按钮
- `color`: 文字颜色
- `background`: 背景色
- `showMenu`: 是否显示菜单按钮

---

## 样式指南

### 颜色使用
- **Primary (#000000)**: 主要标题、重要按钮
- **Tertiary (#D4AF37)**: 强调色、链接、高亮
- **Secondary (#5d5e5f)**: 次要文字、标签
- **Surface (#f9f9f9)**: 页面背景
- **Surface Container (#eeeeee)**: 卡片背景

### 字体使用
- **Noto Serif SC**: 
  - 产品名称
  - 章节标题
  - 品牌名称
  
- **Manrope**: 
  - 英文标签
  - 正文描述
  - 技术参数

### 间距规范
- **页面边距**: 32px (padding: 0 32px)
- **模块间距**: 64-96px (section padding)
- **卡片间距**: 16-32px (gap)
- **元素间距**: 8-16px (margin/padding)

### 圆角规范
- **所有元素**: 0px (border-radius: 0)
- 严格遵循"无圆角"设计原则

---

## 图片资源

所有产品图片使用 Google Cloud Storage URL 存储，已在代码中配置：
- Hero 图片
- 产品图片
- 品牌故事图片
- 系列图片

**注意**: 生产环境需要将这些图片下载到本地 `assets/images/` 目录

---

## 交互反馈

### 触摸反馈
```scss
// 点击效果
&:active {
  opacity: 0.7;
  transform: scale(0.95);
}
```

### 页面切换
- 使用 `wx.navigateTo` 打开新页面
- 使用 `wx.navigateBack` 返回
- 使用 `wx.switchTab` 切换 Tab

### 提示信息
```typescript
// 显示对话框
wx.showModal({
  title: '标题',
  content: '内容',
  confirmText: '确定'
});

// 显示加载中
wx.showLoading({
  title: '加载中'
});
```

---

## 待开发页面

以下页面可根据需要继续开发：
1. **品牌馆** (`pages/heritage/heritage`) - 品牌历史与传承
2. **会员中心** (`pages/member/member`) - 个人中心管理
3. **会员礼遇** (`pages/privileges/privileges`) - 会员专属权益
4. **搜索页面** - 产品搜索功能
5. **购物车** - 购物车功能

---

## 技术栈

- **框架**: 微信小程序
- **语言**: TypeScript
- **样式**: SCSS (SASS)
- **组件**: 自定义组件 + 原生组件
- **渲染**: Skyline 渲染引擎
- **组件框架**: glass-easel

---

## 开发注意事项

### 1. TypeScript 类型
```typescript
// 使用正确的 Component 构造器
Component({
  data: {
    // ...
  },
  methods: {
    // ...
  }
})
```

### 2. 页面路径
- 所有路径相对于 `miniprogram/` 目录
- 使用绝对路径（以 `/` 开头）
- 确保 `app.json` 中已注册页面

### 3. 样式隔离
- 启用 `component2` 编译
- 使用 CSS Modules 或 BEM 命名
- 避免全局样式污染

### 4. 性能优化
- 使用 `scroll-view` 替代 `page-scroll`
- 图片使用 `mode="aspectFill"`
- 合理使用 `wx:if` 和 `hidden`
- 避免频繁 `setData`

### 5. 适配性
- 使用 rpx 进行响应式布局
- 参考 iPhone 6/7/8 尺寸（750rpx）
- 测试不同屏幕尺寸

---

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 编译 SCSS
```bash
# 使用微信开发者工具
# 或手动编译 SCSS 文件
sass styles/design-system.scss styles/design-system.wxss
```

### 3. 预览效果
```bash
# 在微信开发者工具中打开项目
# 选择"品牌首页"作为启动页面
# 即可看到完整的界面效果
```

### 4. 页面访问
- **品牌首页**: 直接访问或 `pages/home/home`
- **腕表系列**: `pages/collections/collections`
- **腕表详情**: `pages/product-detail/product-detail?id=1`

---

## 参考资源

- **Stitch 设计项目**: 腕表详情-深灰配色 (ID: 18446228457406001520)
- **设计系统文档**: `stitch-designs/design-system/DESIGN_SYSTEM.md`
- **HTML 原型**: `stitch-designs/screens/`

---

## 更新日志

### v1.0.0 (2026-03-25)
- ✅ 完成品牌首页开发
- ✅ 完成腕表详情页开发
- ✅ 完成腕表系列页开发
- ✅ 建立设计系统全局样式
- ✅ 更新 app.json 路由配置

---

## 联系方式

如有问题或建议，请联系开发团队。

**最后更新**: 2026-03-25  
**版本**: 1.0.0
