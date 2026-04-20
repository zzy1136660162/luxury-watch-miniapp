-- 检查 product 表结构
DESC product;

-- 如果 points_cost 字段不存在，添加它
ALTER TABLE product ADD COLUMN points_cost INT DEFAULT 0 COMMENT '积分兑换所需积分';

-- 检查 exchange_record 表结构
DESC exchange_record;

-- 为商品设置积分兑换所需的积分（示例）
UPDATE product SET can_redeem_points = 1, points_cost = 1000 WHERE id = 1;
UPDATE product SET can_redeem_points = 1, points_cost = 2000 WHERE id = 2;

-- 检查用户表的 points 字段
DESC wx_user;

-- 为测试用户设置积分
UPDATE wx_user SET points = 5000 WHERE id = 1;
