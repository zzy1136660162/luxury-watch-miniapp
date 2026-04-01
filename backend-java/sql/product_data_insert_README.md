# 商品数据导入说明

## 文件位置

`backend-java/sql/product_data_insert.sql`

## 数据内容

根据 `collections.ts` 中的产品数据生成了以下6个商品：

### 经典系列（Classic）

| 编码 | 名称 | 价格(元) | 库存 |
|-----|------|---------|-----|
| REF-8820-A | 曜石金·自动机械 | 98,000 | 50 |
| REF-5410-L | 流光银·极简主义 | 68,000 | 80 |

### 运动系列（Sport）

| 编码 | 名称 | 价格(元) | 库存 |
|-----|------|---------|-----|
| REF-9900-D | 深海之蓝·探险者 | 158,000 | 30 |
| REF-7701-S | 时空猎手 | 218,000 | 20 |

### 复杂功能系列（Complication）

| 编码 | 名称 | 价格(元) | 库存 |
|-----|------|---------|-----|
| REF-8801-C | 月相万年历 | 358,000 | 15 |

### 女士系列（Ladies）

| 编码 | 名称 | 价格(元) | 库存 |
|-----|------|---------|-----|
| REF-5501-L | 珍珠贝母 | 128,000 | 60 |

## 使用方法

### 方法1：Navicat 导入

1. 打开 Navicat 连接数据库
2. 选择 `luxury-watch-db` 数据库
3. 右键点击 `product` 表
4. 选择"运行 SQL 文件..."
5. 浏览并选择 `product_data_insert.sql` 文件
6. 点击"开始"执行

### 方法2：命令行导入

```bash
mysql -h 101.126.90.255 -P 63306 -u root -p luxury-watch-db < product_data_insert.sql
```

### 方法3：直接复制执行

1. 在 Navicat 或 MySQL Workbench 中打开查询窗口
2. 复制 `product_data_insert.sql` 中的 INSERT 语句
3. 粘贴并执行

## 图片路径说明

### 当前配置

SQL中使用的图片路径格式为：
```
/images/2026-03/collections_0_image.jpg
```

### 实际使用流程

1. **上传图片**
   - 启动后端服务
   - 使用后端管理平台上传商品图片
   - 或使用 Postman 调用上传接口

2. **获取图片路径**
   - 上传接口会返回实际路径，如：
   ```json
   {
     "code": 200,
     "data": {
       "url": "/images/2026-03/heroImage_1743401234567_abc123de.jpg"
     }
   }
   ```

3. **更新数据库**
   - 将返回的 URL 更新到 product 表的 image 字段

### 临时测试用图片路径

如果暂时没有上传图片，可以使用以下本地路径进行测试：

```sql
-- 首页图片（已存在于 D:/项目图标/home/）
'/images/home/heroImage.jpg'
'/images/home/featuredProducts_0_image.jpg'
'/images/home/featuredProducts_1_image.jpg'
'/images/home/brandStoryImage.jpg'
'/images/home/collections_0_image.jpg'
'/images/home/collections_1_image.jpg'
'/images/home/collections_2_image.jpg'

-- 腕表收藏图片（已存在于 D:/项目图标/collections/）
'/images/collections/unnamed.png'
'/images/collections/unnamed (1).png'
'/images/collections/unnamed (2).png'
'/images/collections/unnamed (3).png'
'/images/collections/unnamed (4).png'
```

### 更新图片路径的 SQL

上传图片后，使用以下 SQL 更新：

```sql
-- 更新商品1的图片
UPDATE `product` 
SET `image` = '/images/2026-03/your_actual_image.jpg' 
WHERE `code` = 'REF-8820-A';

-- 批量更新
UPDATE `product` SET `image` = '/images/2026-03/REF-8820-A.jpg' WHERE `code` = 'REF-8820-A';
UPDATE `product` SET `image` = '/images/2026-03/REF-5410-L.jpg' WHERE `code` = 'REF-5410-L';
UPDATE `product` SET `image` = '/images/2026-03/REF-9900-D.jpg' WHERE `code` = 'REF-9900-D';
UPDATE `product` SET `image` = '/images/2026-03/REF-7701-S.jpg' WHERE `code` = 'REF-7701-S';
UPDATE `product` SET `image` = '/images/2026-03/REF-8801-C.jpg' WHERE `code` = 'REF-8801-C';
UPDATE `product` SET `image` = '/images/2026-03/REF-5501-L.jpg' WHERE `code` = 'REF-5501-L';
```

## 推荐做法

### 1. 先导入基础数据

```sql
-- 先清空现有数据（谨慎操作）
-- TRUNCATE TABLE `product`;

-- 导入新的商品数据
INSERT INTO `product` ...;
```

### 2. 上传商品图片

使用后端管理平台的商品管理功能，上传每个商品的图片

### 3. 更新图片路径

上传完成后，根据返回的 URL 更新数据库

### 4. 验证数据

```sql
-- 查看所有商品
SELECT id, name, code, category, price, image FROM `product` WHERE `is_deleted` = 0;

-- 查看某个分类的商品
SELECT * FROM `product` WHERE `category` = 'classic' AND `is_deleted` = 0;
```

## 注意事项

1. **编码唯一性**：商品编码（code）是唯一的，如果已存在会报错
2. **分类ID**：需要确保 category_id 与 sys_category 表中的数据一致
3. **图片路径**：确保图片已上传到服务器并可通过 URL 访问
4. **时区问题**：NOW() 函数使用服务器时区
5. **备份数据**：执行前建议备份现有数据

## 验证清单

- [ ] SQL 执行成功
- [ ] 6条商品记录已插入
- [ ] 商品分类正确
- [ ] 价格和库存数据正确
- [ ] 图片路径配置正确（可选）

## 相关文件

- 表结构定义：`d:\许嘉琦\Documents\product.sql`
- 插入数据：`backend-java/sql/product_data_insert.sql`
- 后端管理平台商品管理：已集成图片上传功能

---

**创建日期：** 2026-03-31  
**最后更新：** 2026-03-31
