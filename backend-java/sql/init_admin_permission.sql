-- ============================================
-- 奢侈品腕表商城 - 后台管理权限系统初始化脚本
-- ============================================

USE luxury-watch-db;

-- 1. 创建管理员表
CREATE TABLE IF NOT EXISTS `admin_user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码(BCrypt加密)',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `phone` VARCHAR(20) COMMENT '手机号',
    `email` VARCHAR(100) COMMENT '邮箱',
    `avatar` VARCHAR(500) COMMENT '头像URL',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删 1-已删'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员用户表';

-- 2. 创建角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
    `role_code` VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    `description` VARCHAR(255) COMMENT '角色描述',
    `sort` INT DEFAULT 0 COMMENT '排序号',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删 1-已删'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 3. 创建用户角色关联表
DROP TABLE IF EXISTS `admin_user_role`;
CREATE TABLE `admin_user_role` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删 1-已删',
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 4. 创建菜单权限表
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `parent_id` BIGINT DEFAULT 0 COMMENT '父菜单ID: 0-顶级',
    `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
    `path` VARCHAR(200) COMMENT '路由路径',
    `component` VARCHAR(255) COMMENT '组件路径',
    `icon` VARCHAR(50) COMMENT '菜单图标',
    `menu_type` TINYINT NOT NULL COMMENT '类型: 1-目录 2-菜单 3-按钮',
    `permission` VARCHAR(100) COMMENT '权限标识(按钮用)',
    `sort` INT DEFAULT 0 COMMENT '排序号',
    `visible` TINYINT DEFAULT 1 COMMENT '是否显示: 0-隐藏 1-显示',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用 1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删 1-已删'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单权限表';

-- 5. 创建角色菜单关联表
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `menu_id` BIGINT NOT NULL COMMENT '菜单ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除: 0-未删 1-已删',
    UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入超级管理员角色 (密码: admin123)
INSERT INTO `sys_role` (`id`, `role_name`, `role_code`, `description`, `sort`, `status`) VALUES
(1, '超级管理员', 'SUPER_ADMIN', '拥有系统所有权限', 1, 1),
(2, '普通管理员', 'ADMIN', '普通管理权限', 2, 1);

-- 插入管理员用户 (密码: admin123, BCrypt加密)
INSERT INTO `admin_user` (`id`, `username`, `password`, `nickname`, `status`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '系统管理员', 1),
(2, 'test', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '测试用户', 1);

-- 关联管理员和角色
INSERT INTO `admin_user_role` (`user_id`, `role_id`) VALUES
(1, 1),  -- admin 关联超级管理员角色
(2, 2);  -- test 关联普通管理员角色

-- 插入菜单数据
INSERT INTO `sys_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `menu_type`, `permission`, `sort`, `visible`, `status`) VALUES
-- 一级菜单
(1, 0, '首页', '/home', 'LAYOUT', 'i-ant-design:home-twotone', 2, NULL, 1, 1, 1),
(2, 0, '系统管理', '/system', 'LAYOUT', 'i-ant-design:setting-twotone', 1, NULL, 100, 1, 1),
(3, 0, '商品管理', '/product', 'LAYOUT', 'i-ant-design:shop-twotone', 1, NULL, 200, 1, 1),
(4, 0, '订单管理', '/order', 'LAYOUT', 'i-ant-design:container-twotone', 1, NULL, 300, 1, 1),

-- 系统管理子菜单
(10, 2, '用户管理', 'user', '/system/user/index', 'i-ant-design:user-twotone', 2, NULL, 1, 1, 1),
(11, 2, '角色管理', 'role', '/system/role/index', 'i-ant-design:team-twotone', 2, NULL, 2, 1, 1),
(12, 2, '菜单管理', 'menu', '/system/menu/index', 'i-ant-design:menu-twotone', 2, NULL, 3, 1, 1),

-- 用户管理按钮权限
(101, 10, '查看用户', NULL, NULL, NULL, 3, 'system:user:list', 1, 1, 1),
(102, 10, '新增用户', NULL, NULL, NULL, 3, 'system:user:add', 2, 1, 1),
(103, 10, '编辑用户', NULL, NULL, NULL, 3, 'system:user:edit', 3, 1, 1),
(104, 10, '删除用户', NULL, NULL, NULL, 3, 'system:user:delete', 4, 1, 1),

-- 角色管理按钮权限
(111, 11, '查看角色', NULL, NULL, NULL, 3, 'system:role:list', 1, 1, 1),
(112, 11, '新增角色', NULL, NULL, NULL, 3, 'system:role:add', 2, 1, 1),
(113, 11, '编辑角色', NULL, NULL, NULL, 3, 'system:role:edit', 3, 1, 1),
(114, 11, '删除角色', NULL, NULL, NULL, 3, 'system:role:delete', 4, 1, 1),
(115, 11, '分配权限', NULL, NULL, NULL, 3, 'system:role:assign', 5, 1, 1);

-- 关联超级管理员角色拥有所有菜单权限
INSERT INTO `sys_role_menu` (`role_id`, `menu_id`)
SELECT 1, `id` FROM `sys_menu` WHERE `deleted` = 0;
