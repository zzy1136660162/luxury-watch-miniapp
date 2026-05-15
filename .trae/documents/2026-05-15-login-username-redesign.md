# 登录页面昵称输入框移除及个人信息昵称修改功能设计

## 1. 背景与目标

### 1.1 项目背景
当前高端名表企业小程序登录页面包含三个输入框：手机号、用户名（昵称）、密码。

### 1.2 需求变更
- **移除昵称输入**：登录页面不再要求用户输入昵称
- **自动生成昵称**：用户登录后，昵称自动生成为"用户" + "电话号"（例如："用户13800138000"）
- **支持昵称修改**：在个人信息页面提供昵称修改功能
- **保持页面结构不变**：不对现有页面布局做结构性调整

### 1.3 设计目标
- 实现最小侵入式改动
- 保持用户体验流畅
- 兼容新老用户（老用户保留原有昵称）

---

## 2. 功能设计

### 2.1 登录页面改动

#### 2.1.1 界面改动（login.wxml）
- **删除**：昵称输入框及其容器（约5行代码）
- **保留**：手机号输入框、密码输入框、登录按钮

#### 2.1.2 逻辑改动（login.ts）
- **删除**：`onUsernameInput`、`onUsernameFocus`、`onUsernameBlur` 方法
- **删除**：data中的 `username`、`usernameFocus` 状态
- **修改**：`onLogin` 方法
  - 删除用户名校验逻辑
  - 自动生成昵称：`const nickname = '用户' + phone`
  - 登录请求中发送 `nickname` 字段

#### 2.1.3 样式改动（login.scss）
- 如有昵称输入框相关的样式，可选择性删除

### 2.2 个人信息页面改动

#### 2.2.1 界面改动（profile.wxml）
- 将"用户名"行改为可点击交互
- 添加底部弹窗组件（modal）
- 弹窗包含：
  - 标题："修改昵称"
  - 输入框：显示当前昵称
  - 取消按钮
  - 确定按钮

#### 2.2.2 逻辑改动（profile.ts）
- **添加** data状态：
  - `showNicknameModal`: boolean - 控制弹窗显示
  - `tempNickname`: string - 临时存储编辑中的昵称
- **添加** 方法：
  - `onNicknameClick`: 点击用户名行时触发，显示弹窗
  - `onNicknameInput`: 输入框内容变化时更新临时昵称
  - `onCancelNickname`: 取消修改，关闭弹窗
  - `onConfirmNickname`: 确认修改，更新昵称并关闭弹窗
- **修改** `loadUserInfo` 方法：
  - 确保从本地存储读取昵称字段
  - 如果没有昵称，使用"用户" + "电话号"作为默认值

#### 2.2.3 样式改动（profile.scss）
- 为用户名行添加点击态样式（如箭头指示）
- 添加底部弹窗样式
- 添加弹窗动画效果

---

## 3. 数据流设计

### 3.1 登录流程
```
用户输入手机号和密码
    ↓
前端验证手机号格式
    ↓
自动生成 nickname = "用户" + phone
    ↓
发送登录请求（包含 nickname 字段）
    ↓
后端保存用户信息（包含 nickname）
    ↓
返回用户信息，前端存储到 localStorage
    ↓
登录成功，跳转到首页
```

### 3.2 昵称修改流程
```
用户在个人信息页面点击"用户名"行
    ↓
显示底部弹窗
    ↓
用户在输入框修改昵称
    ↓
点击"确定"按钮
    ↓
更新本地存储的 userInfo.nickname
    ↓
显示修改成功提示
    ↓
关闭弹窗，页面显示新昵称
```

---

## 4. 接口设计

### 4.1 登录接口（现有接口）
- **请求字段变化**：
  - 新增：`nickname` 字段（自动生成的 "用户" + phone）
- **响应字段**（已包含）：
  - `nickname`: string - 用户昵称

### 4.2 本地存储
- **userInfo 对象**：
  ```typescript
  {
    id: number,
    username: string,
    nickname: string,  // 新增字段
    phone: string,
    avatar: string,
    points: number,
    growthValue: number,
    memberLevel: number,
    memberLevelName: string,
    address: string
  }
  ```

---

## 5. 兼容性设计

### 5.1 老用户兼容
- 老用户登录后，如果 `userInfo` 中没有 `nickname` 字段
- 前端自动生成：`nickname = '用户' + phone`
- 并保存到本地存储

### 5.2 新用户
- 登录时自动生成昵称
- 存储到后端和本地

### 5.3 昵称唯一性
- 当前设计不强制昵称唯一性
- 如需唯一性，需后端接口支持

---

## 6. 错误处理

### 6.1 登录失败
- 保持现有错误提示逻辑
- 不显示用户名相关错误

### 6.2 昵称修改
- 输入为空：提示"昵称不能为空"
- 修改失败：提示"修改失败，请重试"
- 成功：显示成功提示并关闭弹窗

---

## 7. 安全性考虑

### 7.1 昵称内容过滤
- 前端可限制昵称长度（建议：2-20个字符）
- 过滤特殊字符（可选）

### 7.2 数据传输
- 昵称通过 HTTPS 传输
- 使用现有 Token 认证机制

---

## 8. 后端接口改动

### 8.1 现有接口分析

#### 8.1.1 MiniLoginResponse (dto/MiniLoginResponse.java)
- **问题**：convertToResponse 方法**未返回 nickname 字段**
- **解决**：添加 nickname 字段到响应

#### 8.1.2 登录接口 (POST /api/mini/login)
- **现状**：
  - 新用户注册时会设置 nickname
  - 老用户登录时会更新信息
- **改动**：确保响应返回 nickname 字段

#### 8.1.3 更新用户信息接口 (PUT /wx-user/{id})
- **现状**：已存在，可用于更新用户信息
- **用途**：用于修改昵称
- **无需改动**

#### 8.1.4 新增：手机号查询接口 (GET /api/mini/user/by-phone)
- **需求**：根据手机号查询用户昵称
- **路径**：`GET /api/mini/user/by-phone?phone={phone}`
- **响应**：
  ```json
  {
    "code": 200,
    "data": {
      "nickname": "用户13800138000",
      "hasNickname": true
    }
  }
  ```
- **用途**：登录前检查用户是否已有昵称

### 8.2 后端改动清单

1. **修改 MiniLoginResponse.java**
   - 添加 `nickname` 字段
   - 在 convertToResponse 方法中设置 nickname

2. **新增 WxUserService 接口方法**
   - `getNicknameByPhone(String phone)`

3. **实现 WxUserServiceImpl 方法**
   - 根据手机号查询用户昵称

4. **新增 Controller 接口**
   - `GET /api/mini/user/by-phone`

---

## 9. 前端改动清单

### 9.1 登录页面（login）

#### 9.1.1 login.wxml
- 删除昵称输入框（约5行）

#### 9.1.2 login.ts
- 删除 username 相关 data 和方法
- 修改 onLogin：
  - 自动生成 nickname = "用户" + phone
  - 发送 nickname 到后端
  - 保存后端返回的 nickname 到本地存储

### 9.2 个人信息页面（profile）

#### 9.2.1 profile.wxml
- 用户名行添加点击事件
- 添加底部弹窗组件

#### 9.2.2 profile.ts
- 添加弹窗状态管理
- 添加昵称修改方法
- 调用后端 API 更新昵称

#### 9.2.3 profile.scss
- 添加点击态样式
- 添加弹窗样式

### 9.3 API 调用（utils/request.ts）

#### 9.3.1 新增用户 API
```typescript
export const userApi = {
  getNicknameByPhone: (phone: string) => {
    return request({
      url: '/api/mini/user/by-phone',
      method: 'GET',
      data: { phone }
    });
  },
  
  updateNickname: (id: number, nickname: string) => {
    return request({
      url: `/wx-user/${id}`,
      method: 'PUT',
      data: { nickname }
    });
  }
};
```

---

## 10. 数据流程

### 10.1 登录流程（已更新）
```
用户输入手机号和密码
    ↓
前端验证手机号格式
    ↓
自动生成 nickname = "用户" + phone
    ↓
发送登录请求（包含自动生成的 nickname）
    ↓
后端保存用户信息和昵称
    ↓
返回用户信息（包含 nickname）
    ↓
前端保存 nickname 到本地存储
    ↓
登录成功，跳转到首页
```

### 10.2 昵称修改流程（已更新）
```
用户在个人信息页面点击"用户名"行
    ↓
显示底部弹窗
    ↓
用户在输入框修改昵称
    ↓
点击"确定"按钮
    ↓
调用后端 API 更新昵称（PUT /wx-user/{id}）
    ↓
更新本地存储的 userInfo.nickname
    ↓
显示修改成功提示
    ↓
关闭弹窗，页面显示新昵称
```

---

## 11. 实施计划

### 阶段一：后端改动
1. 修改 MiniLoginResponse.java - 添加 nickname 字段
2. 实现 WxUserService.getNicknameByPhone 方法
3. 新增 Controller 接口 - GET /api/mini/user/by-phone
4. 测试后端接口

### 阶段二：登录页面改动
1. 修改 login.wxml - 删除昵称输入框
2. 修改 login.ts - 删除相关逻辑，添加自动生成昵称
3. 测试登录流程

### 阶段三：个人信息页面改动
1. 修改 profile.wxml - 添加可点击行和弹窗
2. 修改 profile.ts - 添加修改昵称逻辑，调用后端API
3. 修改 profile.scss - 添加相关样式
4. 测试昵称修改功能

### 阶段四：兼容性测试
1. 测试老用户登录（已有 nickname）
2. 测试新用户登录（生成 nickname）
3. 测试昵称修改并验证数据库保存
4. 测试后台管理系统查看昵称

---

## 12. 验收标准

### 12.1 功能验收
- ✅ 登录页面不再显示昵称输入框
- ✅ 用户登录后昵称为 "用户" + 电话号
- ✅ 后端数据库保存昵称
- ✅ 个人信息页面可点击用户名修改昵称
- ✅ 修改昵称后即时生效
- ✅ 修改后的昵称保存到数据库
- ✅ 后台管理系统可查看用户昵称

### 12.2 兼容性验收
- ✅ 老用户（已有昵称）登录后显示原有昵称
- ✅ 老用户可以修改昵称
- ✅ 新用户登录自动生成昵称
- ✅ 其他功能不受影响

### 12.3 数据验收
- ✅ 登录时自动生成的昵称保存到 wx_user 表的 nickname 字段
- ✅ 修改的昵称实时更新到数据库
- ✅ 后台管理系统可查询和展示用户昵称

### 12.4 体验验收
- ✅ 界面改动最小化
- ✅ 用户操作流畅
- ✅ 错误提示清晰
