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

        // 过滤掉按钮权限（menu_type = 3），按钮不需要生成路由
        List<SysMenu> menuOnly = allMenus.stream()
                .filter(m -> m.getMenuType() == null || m.getMenuType() != 3)
                .collect(Collectors.toList());

        // 构建菜单树
        return buildMenuTree(menuOnly);
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
        if (menu.getMenuType() != null && menu.getMenuType() == 3 && StringUtils.hasText(menu.getPermission())) {
            meta.put("auth", menu.getPermission());
        }

        // 获取子菜单
        List<SysMenu> children = groupByParent.getOrDefault(menu.getId(), Collections.emptyList());

        if (!children.isEmpty()) {
            // 有子菜单
            List<Map<String, Object>> childNodes = children.stream()
                    .sorted(Comparator.comparingInt(m -> m.getSort() == null ? 0 : m.getSort()))
                    .map(child -> buildMenuNode(child, groupByParent))
                    .collect(Collectors.toList());
            node.put("children", childNodes);

            // 目录类型设置 Layout 组件
            if (menu.getMenuType() != null && menu.getMenuType() == 1) {
                node.put("component", "Layout");
            } else if (StringUtils.hasText(menu.getComponent())) {
                node.put("component", menu.getComponent());
            }
        } else {
            // 没有子菜单
            if (menu.getMenuType() != null && menu.getMenuType() == 1) {
                // 目录类型，始终设置 Layout 组件
                node.put("component", "Layout");
            } else if (menu.getMenuType() != null && menu.getMenuType() == 2) {
                // 菜单类型，设置组件
                if (StringUtils.hasText(menu.getComponent())) {
                    node.put("component", menu.getComponent());
                }
            }
        }

        node.put("meta", meta);
        return node;
    }
}
