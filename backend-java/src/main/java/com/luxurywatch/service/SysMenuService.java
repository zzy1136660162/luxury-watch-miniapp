package com.luxurywatch.service;

import com.luxurywatch.entity.SysMenu;

import java.util.List;
import java.util.Map;

public interface SysMenuService {

    /**
     * 获取用户菜单树
     */
    List<Map<String, Object>> getUserMenus(Long userId);

    /**
     * 获取所有菜单树
     */
    List<SysMenu> getAllMenus();

    /**
     * 根据角色ID获取菜单ID列表
     */
    List<Long> getMenuIdsByRoleId(Long roleId);
}
