package com.luxurywatch.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.luxurywatch.entity.AdminUser;

import java.util.List;
import java.util.Map;

public interface AdminUserService extends IService<AdminUser> {

    /**
     * 根据用户名查询管理员
     */
    AdminUser findByUsername(String username);

    /**
     * 管理员登录
     */
    AdminUser login(String username, String password);

    /**
     * 注册管理员账号
     */
    AdminUser register(String username, String password);

    /**
     * 获取所有管理员列表
     */
    List<Map<String, Object>> listAdmins(String keyword, Integer status);

    /**
     * 创建管理员
     */
    boolean createAdmin(AdminUser admin, Long roleId);

    /**
     * 更新管理员
     */
    boolean updateAdmin(AdminUser admin, Long roleId);

    /**
     * 删除管理员
     */
    boolean deleteAdmin(Long id);

    /**
     * 更新管理员状态
     */
    boolean updateStatus(Long id, Integer status);
}
