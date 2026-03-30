package com.luxurywatch.config;

import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.luxurywatch.entity.*;
import com.luxurywatch.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据库初始化器 - 首次启动时自动创建表和初始化数据
 */
@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private AdminUserMapper adminUserMapper;

    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Autowired
    private SysMenuMapper sysMenuMapper;

    @Autowired
    private AdminUserRoleMapper adminUserRoleMapper;

    @Autowired
    private SysRoleMenuMapper sysRoleMenuMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        // 检查是否已初始化
        Long adminCount = adminUserMapper.selectCount(null);
        if (adminCount > 0) {
            System.out.println(">>> 数据库已初始化，跳过...");
            return;
        }

        System.out.println(">>> 开始初始化数据库...");

        try {
            // 1. 初始化角色
            initRoles();

            // 2. 初始化管理员
            initAdminUsers();

            // 3. 初始化菜单
            initMenus();

            // 4. 关联角色菜单
            initRoleMenus();

            System.out.println(">>> 数据库初始化完成!");
        } catch (Exception e) {
            System.err.println(">>> 数据库初始化失败: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void initRoles() {
        List<SysRole> roles = new ArrayList<>();

        SysRole superAdmin = new SysRole();
        superAdmin.setRoleName("超级管理员");
        superAdmin.setRoleCode("SUPER_ADMIN");
        superAdmin.setDescription("拥有系统所有权限");
        superAdmin.setSort(1);
        superAdmin.setStatus(1);
        roles.add(superAdmin);

        SysRole admin = new SysRole();
        admin.setRoleName("普通管理员");
        admin.setRoleCode("ADMIN");
        admin.setDescription("普通管理权限");
        admin.setSort(2);
        admin.setStatus(1);
        roles.add(admin);

        sysRoleMapper.insertBatch(roles);
        System.out.println(">>> 角色初始化完成: " + roles.size() + " 条");
    }

    private void initAdminUsers() {
        // 使用 BCrypt 加密密码: admin123
        String encodedPassword = passwordEncoder.encode("admin123");

        List<AdminUser> users = new ArrayList<>();

        AdminUser admin = new AdminUser();
        admin.setUsername("admin");
        admin.setPassword(encodedPassword);
        admin.setNickname("系统管理员");
        admin.setStatus(1);
        users.add(admin);

        AdminUser test = new AdminUser();
        test.setUsername("test");
        test.setPassword(encodedPassword);
        test.setNickname("测试用户");
        test.setStatus(1);
        users.add(test);

        adminUserMapper.insertBatch(users);

        // 关联用户角色
        AdminUserRole ur1 = new AdminUserRole();
        ur1.setUserId(1L);
        ur1.setRoleId(1L);  // admin -> SUPER_ADMIN
        adminUserRoleMapper.insert(ur1);

        AdminUserRole ur2 = new AdminUserRole();
        ur2.setUserId(2L);
        ur2.setRoleId(2L);  // test -> ADMIN
        adminUserRoleMapper.insert(ur2);

        System.out.println(">>> 管理员初始化完成: " + users.size() + " 条");
    }

    private void initMenus() {
        List<SysMenu> menus = new ArrayList<>();
        long id = 1;

        // 一级菜单
        menus.add(menu(id++, 0L, "首页", "/home", "LAYOUT", "i-ant-design:home-twotone", 2, "", 1, 1, 1));
        menus.add(menu(id++, 0L, "系统管理", "/system", "LAYOUT", "i-ant-design:setting-twotone", 1, "", 100, 1, 1));
        menus.add(menu(id++, 0L, "商品管理", "/product", "LAYOUT", "i-ant-design:shop-twotone", 1, "", 200, 1, 1));
        menus.add(menu(id++, 0L, "订单管理", "/order", "LAYOUT", "i-ant-design:container-twotone", 1, "", 300, 1, 1));

        // 系统管理子菜单
        menus.add(menu(id++, 2L, "用户管理", "user", "/system/user/index", "i-ant-design:user-twotone", 2, "", 1, 1, 1));
        menus.add(menu(id++, 2L, "角色管理", "role", "/system/role/index", "i-ant-design:team-twotone", 2, "", 2, 1, 1));
        menus.add(menu(id++, 2L, "菜单管理", "menu", "/system/menu/index", "i-ant-design:menu-twotone", 2, "", 3, 1, 1));

        // 用户管理按钮权限
        menus.add(btn(id++, 10L, "查看用户", "system:user:list", 1));
        menus.add(btn(id++, 10L, "新增用户", "system:user:add", 2));
        menus.add(btn(id++, 10L, "编辑用户", "system:user:edit", 3));
        menus.add(btn(id++, 10L, "删除用户", "system:user:delete", 4));

        // 角色管理按钮权限
        menus.add(btn(id++, 11L, "查看角色", "system:role:list", 1));
        menus.add(btn(id++, 11L, "新增角色", "system:role:add", 2));
        menus.add(btn(id++, 11L, "编辑角色", "system:role:edit", 3));
        menus.add(btn(id++, 11L, "删除角色", "system:role:delete", 4));
        menus.add(btn(id++, 11L, "分配权限", "system:role:assign", 5));

        // 菜单管理按钮权限
        menus.add(btn(id++, 12L, "查看菜单", "system:menu:list", 1));
        menus.add(btn(id++, 12L, "新增菜单", "system:menu:add", 2));
        menus.add(btn(id++, 12L, "编辑菜单", "system:menu:edit", 3));
        menus.add(btn(id++, 12L, "删除菜单", "system:menu:delete", 4));

        // 商品管理子菜单
        menus.add(menu(id++, 3L, "商品列表", "list", "/product/list/index", "i-ant-design:unordered-list-outlined", 2, "", 1, 1, 1));
        menus.add(menu(id++, 3L, "商品分类", "category", "/product/category/index", "i-ant-design:appstore-twotone", 2, "", 2, 1, 1));

        // 商品列表按钮权限
        menus.add(btn(id++, 30L, "查看商品", "product:list", 1));
        menus.add(btn(id++, 30L, "新增商品", "product:add", 2));
        menus.add(btn(id++, 30L, "编辑商品", "product:edit", 3));
        menus.add(btn(id++, 30L, "删除商品", "product:delete", 4));
        menus.add(btn(id++, 30L, "批量删除", "product:batchDelete", 5));
        menus.add(btn(id++, 30L, "更新状态", "product:updateStatus", 6));

        // 订单管理子菜单
        menus.add(menu(id++, 4L, "订单列表", "list", "/order/list/index", "i-ant-design:unordered-list-twotone", 2, "", 1, 1, 1));
        menus.add(menu(id++, 4L, "退款管理", "refund", "/order/refund/index", "i-ant-design:refund-twotone", 2, "", 2, 1, 1));

        sysMenuMapper.insertBatch(menus);
        System.out.println(">>> 菜单初始化完成: " + menus.size() + " 条");
    }

    private SysMenu menu(long id, long parentId, String name, String path, String component,
                        String icon, int menuType, String permission, int sort, int visible, int status) {
        SysMenu menu = new SysMenu();
        menu.setId(id);
        menu.setParentId(parentId);
        menu.setName(name);
        menu.setPath(path);
        menu.setComponent(component);
        menu.setIcon(icon);
        menu.setMenuType(menuType);
        menu.setPermission(permission);
        menu.setSort(sort);
        menu.setVisible(visible);
        menu.setStatus(status);
        return menu;
    }

    private SysMenu btn(long id, long parentId, String name, String permission, int sort) {
        SysMenu menu = new SysMenu();
        menu.setId(id);
        menu.setParentId(parentId);
        menu.setName(name);
        menu.setMenuType(3);
        menu.setPermission(permission);
        menu.setSort(sort);
        menu.setVisible(1);
        menu.setStatus(1);
        return menu;
    }

    private void initRoleMenus() {
        // 超级管理员拥有所有菜单权限
        List<SysMenu> allMenus = sysMenuMapper.selectList(null);
        List<SysRoleMenu> roleMenus = new ArrayList<>();

        for (SysMenu menu : allMenus) {
            SysRoleMenu rm = new SysRoleMenu();
            rm.setRoleId(1L);  // SUPER_ADMIN
            rm.setMenuId(menu.getId());
            roleMenus.add(rm);
        }

        sysRoleMenuMapper.insertBatch(roleMenus);
        System.out.println(">>> 角色菜单关联完成: " + roleMenus.size() + " 条");
    }
}
