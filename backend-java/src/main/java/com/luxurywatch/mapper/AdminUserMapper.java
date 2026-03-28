package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.AdminUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AdminUserMapper extends BaseMapper<AdminUser> {

    /**
     * 批量插入
     */
    default void insertBatch(List<AdminUser> list) {
        if (list == null || list.isEmpty()) return;
        for (AdminUser user : list) {
            insert(user);
        }
    }

    @Select("SELECT * FROM admin_user WHERE username = #{username} AND deleted = 0 LIMIT 1")
    AdminUser selectByUsername(String username);
}
