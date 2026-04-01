-- ============================================
-- 小程序登录功能数据库改造
-- ============================================

-- 1. 添加成长值字段（先检查字段是否存在）
-- 如果字段已存在会报错，可以忽略错误继续执行

ALTER TABLE wx_user ADD COLUMN growth_value INT DEFAULT 0 COMMENT '成长值' AFTER points;

-- 或者使用存储过程检查后添加（适用于不支持 IF NOT EXISTS 的MySQL版本）
-- DELIMITER //
-- DROP PROCEDURE IF EXISTS add_growth_value_column//
-- CREATE PROCEDURE add_growth_value_column()
-- BEGIN
--   IF NOT EXISTS (
--     SELECT * FROM information_schema.COLUMNS 
--     WHERE TABLE_SCHEMA = DATABASE() 
--     AND TABLE_NAME = 'wx_user' 
--     AND COLUMN_NAME = 'growth_value'
--   ) THEN
--     ALTER TABLE wx_user ADD COLUMN growth_value INT DEFAULT 0 COMMENT '成长值' AFTER points;
--   END IF;
-- END//
-- DELIMITER ;
-- CALL add_growth_value_column();

-- 2. 查看当前表结构
DESCRIBE wx_user;

-- 3. 查看现有用户数据
SELECT id, username, points, growth_value, member_level FROM wx_user LIMIT 10;
