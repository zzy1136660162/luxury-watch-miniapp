package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.AdminUserRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AdminUserRoleMapper extends BaseMapper<AdminUserRole> {

    @Select("SELECT * FROM admin_user_role WHERE user_id = #{userId} AND deleted = 0")
    List<AdminUserRole> selectByUserId(@Param("userId") Long userId);

    @Select("DELETE FROM admin_user_role WHERE user_id = #{userId} AND deleted = 0")
    void deleteByUserId(@Param("userId") Long userId);
}
