-- ============================================
-- 微信登录功能数据库改造
-- ============================================

-- 1. 添加微信头像字段
ALTER TABLE wx_user ADD COLUMN wechat_avatar VARCHAR(500) COMMENT '微信头像URL' AFTER avatar;

-- 2. 查看当前表结构
DESCRIBE wx_user;

-- 3. 查看现有用户数据
SELECT id, username, avatar, wechat_avatar, phone FROM wx_user LIMIT 10;
