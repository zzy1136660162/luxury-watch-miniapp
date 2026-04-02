package com.luxurywatch.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.luxurywatch.entity.WxUser;

public interface WxUserService extends IService<WxUser> {

    /**
     * 分页查询小程序用户列表
     */
    Page<WxUser> pageWxUser(Page<WxUser> page, String keyword, String phone, Integer memberLevel, Integer status);

    /**
     * 更新小程序用户状态
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 更新小程序用户会员等级
     */
    boolean updateMemberLevel(Long id, Integer level);

    /**
     * 调整小程序用户积分
     */
    boolean adjustPoints(Long id, Integer points, String description);

    /**
     * 重置小程序用户密码
     */
    boolean resetPassword(Long id);
}