package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.SysRoleMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SysRoleMenuMapper extends BaseMapper<SysRoleMenu> {

    /**
     * 批量插入
     */
    default void insertBatch(List<SysRoleMenu> list) {
        if (list == null || list.isEmpty()) return;
        for (SysRoleMenu rm : list) {
            insert(rm);
        }
    }

    @Select("SELECT menu_id FROM sys_role_menu WHERE role_id = #{roleId} AND deleted = 0")
    List<Long> selectMenuIdsByRoleId(@Param("roleId") Long roleId);

    @Select("DELETE FROM sys_role_menu WHERE role_id = #{roleId} AND deleted = 0")
    void deleteByRoleId(@Param("roleId") Long roleId);
}
