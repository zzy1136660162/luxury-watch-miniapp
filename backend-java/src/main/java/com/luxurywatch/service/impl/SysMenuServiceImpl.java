package com.luxurywatch.service.impl;

import com.luxurywatch.entity.SysMenu;
import com.luxurywatch.mapper.SysMenuMapper;
import com.luxurywatch.service.SysMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SysMenuServiceImpl implements SysMenuService {

    @Autowired
    private SysMenuMapper sysMenuMapper;

    @Override
    public List<Map<String, Object>> getUserMenus(Long userId) {
        // 获取用户所有菜单
        List<SysMenu> allMenus = sysMenuMapper.selectByUserId(userId);
        if (allMenus.isEmpty()) {
            return new ArrayList<>();
        }

        // 构建菜单树
        return buildMenuTree(allMenus);
    }

    @Override
    public List<SysMenu> getAllMenus() {
        return sysMenuMapper.selectList(null);
    }

    @Override
    public List<Long> getMenuIdsByRoleId(Long roleId) {
        return sysMenuMapper.selectMenuIdsByRoleId(roleId);
    }

    /**
     * 构建菜单树
     */
    private List<Map<String, Object>> buildMenuTree(List<SysMenu> menus) {
        // 按 parentId 分组
        Map<Long, List<SysMenu>> groupByParent = menus.stream()
                .collect(Collectors.groupingBy(SysMenu::getParentId));

        // 获取顶级菜单
        List<SysMenu> rootMenus = groupByParent.getOrDefault(0L, Collections.emptyList());

        // 递归构建树
        return rootMenus.stream()
                .sorted(Comparator.comparingInt(m -> m.getSort() == null ? 0 : m.getSort()))
                .map(menu -> buildMenuNode(menu, groupByParent))
                .collect(Collectors.toList());
    }

    /**
     * 构建单个菜单节点
     */
    private Map<String, Object> buildMenuNode(SysMenu menu, Map<Long, List<SysMenu>> groupByParent) {
        Map<String, Object> node = new LinkedHashMap<>();
        node.put("path", menu.getPath());

        // 构建 meta 信息
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("title", menu.getName());
        meta.put("icon", menu.getIcon());
        meta.put("menuType", menu.getMenuType());

        // 如果是按钮，添加权限标识
        if (menu.getMenuType() == 3 && StringUtils.hasText(menu.getPermission())) {
            meta.put("auth", menu.getPermission());
        }

        // 获取子菜单
        List<SysMenu> children = groupByParent.getOrDefault(menu.getId(), Collections.emptyList());

        if (!children.isEmpty()) {
            // 有子菜单，是目录或菜单
            if (menu.getMenuType() == 1) {
                // 目录类型
                node.put("component", "Layout");
            } else {
                // 菜单类型
                node.put("component", menu.getComponent());
            }

            List<Map<String, Object>> childNodes = children.stream()
                    .sorted(Comparator.comparingInt(m -> m.getSort() == null ? 0 : m.getSort()))
                    .map(child -> buildMenuNode(child, groupByParent))
                    .collect(Collectors.toList());
            node.put("children", childNodes);
        } else {
            // 没有子菜单
            if (menu.getMenuType() == 2) {
                // 菜单类型
                node.put("component", menu.getComponent());
            }
        }

        node.put("meta", meta);
        return node;
    }

    /**
     * 构建菜单元信息
     */
    private Map<String, Object> buildMenuMeta(SysMenu menu) {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("title", menu.getName());
        meta.put("icon", menu.getIcon());
        meta.put("menuType", menu.getMenuType());

        // 如果是按钮，添加权限标识
        if (menu.getMenuType() == 3 && StringUtils.hasText(menu.getPermission())) {
            meta.put("auth", menu.getPermission());
        }

        return meta;
    }
}
