package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.SysMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysMenuMapper extends BaseMapper<SysMenu> {

    /**
     * 批量插入
     */
    default void insertBatch(List<SysMenu> list) {
        if (list == null || list.isEmpty()) return;
        for (SysMenu menu : list) {
            insert(menu);
        }
    }

    /**
     * 根据用户ID获取菜单列表
     */
    List<SysMenu> selectByUserId(@Param("userId") Long userId);

    /**
     * 根据角色ID获取菜单ID列表
     */
    List<Long> selectMenuIdsByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据角色ID列表获取菜单列表
     */
    List<SysMenu> selectByRoleIds(@Param("roleIds") String roleIds);
}
