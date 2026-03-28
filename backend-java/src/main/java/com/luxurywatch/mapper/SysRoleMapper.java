package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.SysRole;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysRoleMapper extends BaseMapper<SysRole> {

    /**
     * 批量插入
     */
    default void insertBatch(List<SysRole> list) {
        if (list == null || list.isEmpty()) return;
        for (SysRole role : list) {
            insert(role);
        }
    }

    /**
     * 根据用户ID获取角色列表
     */
    List<SysRole> selectByUserId(Long userId);
}
