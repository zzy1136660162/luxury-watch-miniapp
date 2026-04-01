-- 商品图片路径更新SQL模板
-- 使用说明：
-- 1. 先上传商品图片到后端服务
-- 2. 根据上传返回的路径更新此SQL
-- 3. 执行SQL更新商品图片
-- 
-- 上传接口返回格式：
-- {"code":200,"msg":"success","data":{"url":"/images/2026-03/文件名.jpg",...}}

-- ============================================
-- 请将下面的路径替换为实际上传后的路径
-- ============================================

-- 示例更新语句（根据实际路径修改）
-- UPDATE `product` SET `image` = '/images/2026-03/实际文件名.jpg' WHERE `id` = 1;

-- 或者根据商品编码更新
-- UPDATE `product` SET `image` = '/images/2026-03/实际文件名.jpg' WHERE `code` = 'REF-8820-A';

-- ============================================
-- 批量更新模板（上传后复制替换）
-- ============================================

-- 经典系列
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-8820-A';
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-5410-L';

-- 运动系列
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-9900-D';
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-7701-S';

-- 复杂功能系列
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-8801-C';

-- 女士系列
-- UPDATE `product` SET `image` = '/images/2026-03/您的文件名.jpg' WHERE `code` = 'REF-5501-L';

-- ============================================
-- 验证查询
-- ============================================

-- 查看所有商品的图片配置情况
SELECT 
    id,
    name,
    code,
    category,
    price,
    image,
    CASE 
        WHEN image IS NULL OR image = '' THEN '❌ 未配置'
        WHEN image LIKE '/images/%' THEN '✅ 已配置'
        ELSE '⚠️ 外部链接'
    END AS status
FROM `product` 
WHERE `is_deleted` = 0 
ORDER BY category, id;

-- 统计图片配置情况
SELECT 
    '总商品数' AS 指标,
    COUNT(*) AS 数值
FROM `product` WHERE `is_deleted` = 0
UNION ALL
SELECT 
    '已配置图片',
    COUNT(*) 
FROM `product` 
WHERE `is_deleted` = 0 AND `image` IS NOT NULL AND `image` LIKE '/images/%'
UNION ALL
SELECT 
    '未配置图片',
    COUNT(*) 
FROM `product` 
WHERE `is_deleted` = 0 AND (image IS NULL OR image = '' OR image NOT LIKE '/images/%');
