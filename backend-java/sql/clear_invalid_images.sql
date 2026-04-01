-- 清理商品表中无效的图片路径
-- 说明：删除 via.placeholder.com 等外部占位图链接，这些应该在上传真实图片后更新

-- 查看当前所有商品的图片路径
SELECT id, name, image FROM `product` WHERE `is_deleted` = 0;

-- 将无效的图片路径设置为 NULL（可选）
-- 如果希望保留商品数据，只清理图片路径，使用此语句：
-- UPDATE `product` SET `image` = NULL WHERE `image` LIKE '%placeholder%' OR `image` LIKE '%via.placeholder%';

-- 或者删除图片字段中的无效值（谨慎操作）
-- UPDATE `product` SET `image` = NULL WHERE `image` IS NOT NULL AND `image` != '' AND NOT `image` LIKE '/images/%';

-- 查看有多少商品的图片是无效的
SELECT COUNT(*) as invalid_count 
FROM `product` 
WHERE `is_deleted` = 0 
  AND (
    `image` LIKE '%placeholder%' 
    OR `image` LIKE '%via.placeholder%'
    OR `image` LIKE 'http://%'
    OR `image` LIKE 'https://%'
  );

-- 统计有图片的商品数量
SELECT COUNT(*) as valid_count 
FROM `product` 
WHERE `is_deleted` = 0 
  AND `image` IS NOT NULL 
  AND `image` != '' 
  AND `image` LIKE '/images/%';

-- 建议：
-- 1. 首先查看所有商品的图片路径
-- 2. 对于需要保留的商品，手动上传真实图片
-- 3. 使用新的图片路径更新数据库
-- 4. 如果想清空所有图片，可以执行：
--    UPDATE `product` SET `image` = NULL WHERE `is_deleted` = 0;
