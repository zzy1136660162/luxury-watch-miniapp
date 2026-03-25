# Stitch Design Project: 腕表详情-深灰配色

## 项目概述 (Project Overview)

本项目包含了 **Chronos Heritage** 设计系统下的高端腕表小程序界面设计，采用深灰配色方案，呈现奢华、精致的视觉体验。

- **项目ID**: 18446228457406001520
- **设计系统**: Chronos Heritage
- **设备类型**: Mobile (移动端)
- **主题**: 深灰配色 (Deep Grey Color Scheme)

---

## 目录结构 (Directory Structure)

```
stitch-designs/
├── design-system/
│   └── DESIGN_SYSTEM.md              # 设计系统完整文档
├── screens/
│   ├── 01-timepiece-detail/
│   │   ├── timepiece-detail.html    # 腕表详情页面代码
│   │   └── timepiece-detail.png     # 腕表详情截图
│   ├── 02-brand-heritage/
│   │   ├── brand-heritage.html      # 品牌馆页面代码
│   │   └── brand-heritage.png       # 品牌馆截图
│   ├── 03-watch-collections/
│   │   ├── watch-collections.html   # 腕表系列页面代码
│   │   └── watch-collections.png    # 腕表系列截图
│   ├── 04-member-privileges/
│   │   ├── member-privileges.html   # 会员礼遇页面代码
│   │   └── member-privileges.png    # 会员礼遇截图
│   ├── 05-membership-center/
│   │   ├── membership-center.html   # 会员中心页面代码
│   │   └── membership-center.png    # 会员中心截图
│   └── 06-brand-home/
│       ├── brand-home.html          # 品牌首页页面代码
│       └── brand-home.png           # 品牌首页截图
└── README.md                        # 本文档
```

---

## 屏幕列表 (Screens)

### 1. 腕表详情 (Timepiece Detail)
- **文件**: `01-timepiece-detail/`
- **尺寸**: 780 x 6994 px
- **描述**: 展示单款腕表的详细信息，包括高清大图、规格参数、设计故事等

### 2. 品牌馆 (Brand Heritage)
- **文件**: `02-brand-heritage/`
- **尺寸**: 780 x 12518 px
- **描述**: 品牌历史与传承展示页面，包含品牌故事、发展历程等

### 3. 腕表系列 (Watch Collections)
- **文件**: `03-watch-collections/`
- **尺寸**: 780 x 10794 px
- **描述**: 全系列腕表展示页面，支持分类筛选和浏览

### 4. 会员礼遇 (Member Privileges)
- **文件**: `04-member-privileges/`
- **尺寸**: 780 x 6004 px
- **描述**: 会员专属权益和优惠活动展示页面

### 5. 会员中心 (Membership Center)
- **文件**: `05-membership-center/`
- **尺寸**: 780 x 4504 px
- **描述**: 用户个人信息管理、订单查询、积分兑换等会员功能

### 6. 品牌首页 (Brand Home)
- **文件**: `06-brand-home/`
- **尺寸**: 780 x 7982 px
- **描述**: 小程序主页面，包含品牌介绍、最新产品、热门活动等入口

---

## 设计系统 (Design System)

### 核心理念 (Core Philosophy)
**"The Digital Curator"** - 数字策展人

设计强调：
- **Intentional Asymmetry** (刻意的不对称)
- **Editorial Breathing Room** (编辑级留白)
- **High-contrast Print-on-Silk** (高对比度的丝印效果)

### 配色方案 (Color Palette)

#### 主色系 (Primary Colors)
- **Primary**: #000000 - 核心品牌色，用于主要标题
- **Primary Container**: #1A1A1A - 深炭灰，用于沉浸式区块
- **On Primary**: #ffffff - 白色文字

#### 强调色 (Accent Colors)
- **Champagne Gold**: #D4AF37 - 香槟金，用于CTA和重点元素
- **Metallic Silver**: #C0C0C0 - 金属银，用于技术参数和英文副标题

#### 表面色 (Surface Colors)
- **Background**: #f9f9f9 - 浅灰背景
- **Surface Container**: #eeeeee - 卡片背景
- **Surface Container Lowest**: #ffffff - 纯白卡片

### 字体系统 (Typography)

#### 中文字体 (Chinese)
- **Noto Serif SC** - 用于标题和主要信息
- 特点：高对比度，体现制表工艺的精致感

#### 英文字体 (English)
- **Manrope** - 用于正文和技术描述
- 特点：几何感强，体现瑞士制表的精准感

### 设计原则 (Design Principles)

#### ✅ 推荐做法
- 使用大量垂直留白
- 将中文字符作为图形元素处理
- 谨慎使用香槟金色作为焦点工具

#### ❌ 避免做法
- 不要使用圆角（0px radius）
- 不要使用通用图标（需超细线条）
- 不要使用纯灰色（使用带色偏的中性色）

### 交互设计 (Interactions)

#### 按钮设计
- **Primary**: 矩形（0px圆角），纯黑背景，白色文字
- **Tertiary**: 金色下划线，用于"了解更多"等链接

#### 输入框
- 底部单线条样式
- 聚焦时线条变为金色并从中间展开

#### 卡片设计
- 禁止使用分隔线
- 使用 4rem 间距分离列表项
- 产品图使用 1:1 或 4:5 比例

---

## 使用说明 (Usage Instructions)

### 查看截图
每个屏幕文件夹中都包含了 `.png` 格式的预览截图，可以直接查看设计效果。

### 查看代码
每个屏幕文件夹中都包含了 `.html` 格式的代码文件，可以使用浏览器打开查看完整交互效果。

### 开发参考
1. 阅读 `design-system/DESIGN_SYSTEM.md` 了解完整设计系统
2. 查看各屏幕截图了解视觉效果
3. 参考 HTML 代码进行小程序开发

---

## 技术规格 (Technical Specifications)

- **设备宽度**: 780px (移动端)
- **渲染引擎**: 支持 Skyline 渲染模式
- **组件框架**: glass-easel
- **设计工具**: Stitch (Google)

---

## 备注 (Notes)

- 所有屏幕均为移动端设计
- 支持深色模式下的视觉一致性
- 设计遵循 WCAG AA 无障碍标准
- 使用 Sass/SCSS 进行样式预处理

---

## 相关资源 (Related Resources)

- **设计系统**: Chronos Heritage
- **原始项目**: https://stitch.google.com/project/18446228457406001520

---

**最后更新**: 2026-03-25  
**版本**: 1.0
