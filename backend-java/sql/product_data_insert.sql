-- 商品数据插入语句
-- 根据 collections.ts 中的产品数据生成

INSERT INTO `product` (`name`, `code`, `category_id`, `category`, `image`, `images`, `price`, `original_price`, `stock`, `sales`, `status`, `sort`, `description`, `create_time`, `update_time`) VALUES
-- 经典系列
('曜石金·自动机械', 'REF-8820-A', 4, 'classic', '/images/2026-03/collections_0_image.jpg', '[]', 98000.00, 128000.00, 50, 28, 1, 10, '搭载定制 Cal.900 动力机芯，配备 72 小时超长动力储存。曜石黑表盘与 18K 黄金表壳的完美邂逅，彰显沉稳不凡的气度。', NOW(), NOW()),
('流光银·极简主义', 'REF-5410-L', 4, 'classic', '/images/2026-03/collections_1_image.jpg', '[]', 68000.00, 88000.00, 80, 45, 1, 9, '抛弃繁杂，回归时间的本质。极致纤薄的 5.5mm 表壳设计，采用航天级精钢材质，如同月光轻抚腕间。', NOW(), NOW()),

-- 运动系列
('深海之蓝·探险者', 'REF-9900-D', 5, 'sport', '/images/2026-03/collections_2_image.jpg', '[]', 158000.00, 198000.00, 30, 15, 1, 8, '300米专业级防水，配有陶瓷旋转表圈。深邃的蓝色放射纹表盘，在不同光线下折射出如海洋般的万千变幻。', NOW(), NOW()),
('时空猎手', 'REF-7701-S', 5, 'sport', '/images/2026-03/collections_3_image.jpg', '[]', 218000.00, 268000.00, 20, 12, 1, 7, '穿梭于星际阔境，精准捕捉每一瞬即逝的光阴。在极简设计中蕴含无穷的精密力学。', NOW(), NOW()),

-- 复杂功能系列
('月相万年历', 'REF-8801-C', 6, 'complication', '/images/2026-03/complication_1_image.jpg', '[]', 358000.00, 428000.00, 15, 8, 1, 6, '复杂功能腕表的巅峰之作，集月相显示、万年历、计时功能于一身，展现精湛制表工艺。', NOW(), NOW()),

-- 女士系列
('珍珠贝母', 'REF-5501-L', 7, 'ladies', '/images/2026-03/ladies_1_image.jpg', '[]', 128000.00, 158000.00, 60, 35, 1, 5, '专为女性设计的优雅腕表，珍珠贝母表盘搭配钻石时标，展现女性的柔美与高贵。', NOW(), NOW());

-- 验证插入结果
SELECT id, name, code, category, price, stock, status FROM `product` WHERE `is_deleted` = 0 ORDER BY `sort` DESC;
