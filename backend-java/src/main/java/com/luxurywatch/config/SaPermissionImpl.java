package com.luxurywatch.config;

import cn.dev33.satoken.stp.StpInterface;
import com.luxurywatch.entity.SysMenu;
import com.luxurywatch.entity.SysRole;
import com.luxurywatch.mapper.SysMenuMapper;
import com.luxurywatch.mapper.SysRoleMapper;
import com.luxurywatch.mapper.AdminUserRoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Sa-Token 权限认证实现类
 * 实时从数据库查询用户权限/角色
 */
@Component
public class SaPermissionImpl implements StpInterface {

    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Autowired
    private SysMenuMapper sysMenuMapper;

    @Autowired
    private AdminUserRoleMapper adminUserRoleMapper;

    /**
     * 获取用户角色列表
     */
    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        Long userId = Long.parseLong(loginId.toString());
        List<SysRole> roles = sysRoleMapper.selectByUserId(userId);
        return roles.stream()
                .map(SysRole::getRoleCode)
                .collect(Collectors.toList());
    }

    /**
     * 获取用户权限列表 (权限标识)
     */
    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        Long userId = Long.parseLong(loginId.toString());

        // 获取用户菜单列表
        List<SysMenu> menus = sysMenuMapper.selectByUserId(userId);

        // 提取权限标识 (menuType=3 的菜单是按钮权限)
        return menus.stream()
                .filter(menu -> menu.getMenuType() == 3 && StringUtils.hasText(menu.getPermission()))
                .map(SysMenu::getPermission)
                .collect(Collectors.toList());
    }
}
