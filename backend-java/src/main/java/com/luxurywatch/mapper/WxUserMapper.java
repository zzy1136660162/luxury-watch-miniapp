package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.luxurywatch.entity.WxUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WxUserMapper extends BaseMapper<WxUser> {

    /**
     * 批量插入
     */
    default void insertBatch(List<WxUser> list) {
        if (list == null || list.isEmpty()) return;
        for (WxUser user : list) {
            insert(user);
        }
    }

    /**
     * 根据用户名查询用户
     */
    @Select("SELECT * FROM wx_user WHERE username = #{username} AND deleted = 0 LIMIT 1")
    WxUser selectByUsername(String username);

    /**
     * 根据手机号查询用户
     */
    @Select("SELECT * FROM wx_user WHERE phone = #{phone} AND deleted = 0 LIMIT 1")
    WxUser selectByPhone(String phone);
}