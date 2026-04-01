-- =====================================================
-- 商品图片路径更新SQL
-- =====================================================
-- 说明：根据实际上传的图片，更新商品的 image 字段
-- 执行时机：在上传商品图片后执行
-- =====================================================

-- 方案1：使用已存在的本地图片（测试用）
-- 注意：这些路径需要在服务器上实际存在才能访问

-- 经典系列图片更新
UPDATE `product` SET `image` = '/images/home/featuredProducts_0_image.jpg' WHERE `code` = 'REF-8820-A';
UPDATE `product` SET `image` = '/images/home/featuredProducts_1_image.jpg' WHERE `code` = 'REF-5410-L';

-- 运动系列图片更新
UPDATE `product` SET `image` = '/images/home/collections_0_image.jpg' WHERE `code` = 'REF-9900-D';
UPDATE `product` SET `image` = '/images/home/collections_1_image.jpg' WHERE `code` = 'REF-7701-S';

-- 复杂功能系列图片更新
UPDATE `product` SET `image` = '/images/home/collections_2_image.jpg' WHERE `code` = 'REF-8801-C';

-- 女士系列图片更新
UPDATE `product` SET `image` = '/images/home/collections_0_image.jpg' WHERE `code` = 'REF-5501-L';


-- =====================================================
-- 方案2：根据上传后的实际路径更新
-- 使用说明：上传图片后，将返回的URL替换到对应的UPDATE语句中
-- =====================================================

-- 曜石金·自动机械 (REF-8820-A)
-- 将 '/images/2026-03/实际文件名.jpg' 替换为上传返回的实际路径
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-8820-A';

-- 流光银·极简主义 (REF-5410-L)
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-5410-L';

-- 深海之蓝·探险者 (REF-9900-D)
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-9900-D';

-- 时空猎手 (REF-7701-S)
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-7701-S';

-- 月相万年历 (REF-8801-C)
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-8801-C';

-- 珍珠贝母 (REF-5501-L)
-- UPDATE `product` SET `image` = '/images/2026-03/your_filename.jpg' WHERE `code` = 'REF-5501-L';


-- =====================================================
-- 方案3：批量更新（根据上传顺序）
-- 适用于按顺序上传了6张图片的情况
-- =====================================================

-- 第1张图片 -> 曜石金·自动机械
-- UPDATE `product` SET `image` = '/images/2026-03/img1_timestamp.jpg' WHERE `code` = 'REF-8820-A';

-- 第2张图片 -> 流光银·极简主义
-- UPDATE `product` SET `image` = '/images/2026-03/img2_timestamp.jpg' WHERE `code` = 'REF-5410-L';

-- 第3张图片 -> 深海之蓝·探险者
-- UPDATE `product` SET `image` = '/images/2026-03/img3_timestamp.jpg' WHERE `code` = 'REF-9900-D';

-- 第4张图片 -> 时空猎手
-- UPDATE `product` SET `image` = '/images/2026-03/img4_timestamp.jpg' WHERE `code` = 'REF-7701-S';

-- 第5张图片 -> 月相万年历
-- UPDATE `product` SET `image` = '/images/2026-03/img5_timestamp.jpg' WHERE `code` = 'REF-8801-C';

-- 第6张图片 -> 珍珠贝母
-- UPDATE `product` SET `image` = '/images/2026-03/img6_timestamp.jpg' WHERE `code` = 'REF-5501-L';


-- =====================================================
-- 验证查询
-- =====================================================

-- 查看所有商品及其图片
SELECT 
    id,
    name,
    code,
    category,
    price,
    image,
    CASE 
        WHEN image LIKE '/images/%' THEN '✅ 已配置'
        ELSE '❌ 未配置'
    END AS image_status
FROM `product` 
WHERE `is_deleted` = 0 
ORDER BY category, id;

-- 统计图片配置情况
SELECT 
    COUNT(*) AS total_products,
    SUM(CASE WHEN image IS NOT NULL AND image != '' THEN 1 ELSE 0 END) AS products_with_image,
    SUM(CASE WHEN image IS NULL OR image = '' THEN 1 ELSE 0 END) AS products_without_image
FROM `product` 
WHERE `is_deleted` = 0;
