package com.luxurywatch.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.luxurywatch.entity.AdminUser;

public interface AdminUserService extends IService<AdminUser> {

    /**
     * 根据用户名查询管理员
     */
    AdminUser findByUsername(String username);

    /**
     * 管理员登录
     */
    AdminUser login(String username, String password);
}
