-- 添加测试商品数据
-- 注意：请根据你的实际表结构调整

-- 如果表不存在，可以先创建（假设使用 MySQL）
-- CREATE TABLE IF NOT EXISTS `product` (
--   `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
--   `name` VARCHAR(255) NOT NULL COMMENT '商品名称',
--   `brand` VARCHAR(255) COMMENT '品牌',
--   `series` VARCHAR(255) COMMENT '系列',
--   `price` DECIMAL(10,2) DEFAULT 0,
--   `stock` INT DEFAULT 0,
--   `status` TINYINT DEFAULT 1,
--   `category` VARCHAR(255),
--   `category_id` BIGINT,
--   `code` VARCHAR(100),
--   `image` TEXT,
--   `images` TEXT,
--   `description` TEXT,
--   `content` TEXT,
--   `is_deleted` TINYINT DEFAULT 0,
--   `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
--   `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   KEY `idx_brand` (`brand`),
--   KEY `idx_series` (`series`)
-- );

-- 插入测试数据
INSERT INTO `product` (`name`, `brand`, `series`, `price`, `stock`, `status`, `code`, `category`, `description`) VALUES
('劳力士Submariner潜水表', '劳力士', 'Submariner', 80000.00, 5, 1, 'RLX-SUB-001', 'watch', '经典潜水腕表，防水深度300米'),
('劳力士Datejust日志型', '劳力士', 'Datejust', 65000.00, 3, 1, 'RLX-DJ-001', 'watch', '经典商务腕表，日期显示'),
('欧米茄海马300米', '欧米茄', 'Seamaster', 45000.00, 8, 1, 'OM-SEA-001', 'watch', '专业潜水腕表，防水深度300米'),
('欧米茄超霸登月表', '欧米茄', 'Speedmaster', 55000.00, 4, 1, 'OM-SPD-001', 'watch', '经典计时腕表，曾登上月球'),
('天梭力洛克系列', '天梭', '力洛克', 5000.00, 15, 1, 'TS-LOC-001', 'watch', '入门级机械腕表，经典设计'),
('卡地亚蓝气球', '卡地亚', '蓝气球', 38000.00, 6, 1, 'CT-BAL-001', 'watch', '经典女士腕表，罗马数字表盘'),
('百达翡丽鹦鹉螺', '百达翡丽', '鹦鹉螺', 250000.00, 2, 1, 'PP-NAU-001', 'watch', '顶级运动腕表，经典设计'),
('沛纳海Luminor', '沛纳海', 'Luminor', 32000.00, 5, 1, 'PN-LUM-001', 'watch', '意大利风格，经典护桥设计'),
('万国葡萄牙系列', '万国', '葡萄牙', 48000.00, 4, 1, 'IW-POR-001', 'watch', '经典商务腕表，大表盘设计'),
('积家约会系列', '积家', '约会', 68000.00, 3, 1, 'JA-REN-001', 'watch', '女士高级腕表，优雅设计');
