package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.service.WxUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wx-user")
public class WxUserController {

    @Autowired
    private WxUserService wxUserService;

    /**
     * 获取小程序用户列表
     */
    @GetMapping("/list")
    public R<PageResult<WxUser>> list(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) Integer memberLevel,
            @RequestParam(required = false) Integer status) {
        
        // 权限检查
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        Page<WxUser> page = new Page<>(pageNum, pageSize);
        Page<WxUser> result = wxUserService.pageWxUser(page, keyword, phone, memberLevel, status);
        return R.success(new PageResult<>(result.getRecords(), result.getTotal()));
    }

    /**
     * 获取小程序用户详情
     */
    @GetMapping("/{id}")
    public R<WxUser> getById(@PathVariable Long id) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        WxUser user = wxUserService.getById(id);
        return user != null ? R.success(user) : R.error("用户不存在");
    }

    /**
     * 更新小程序用户信息
     */
    @PutMapping("/{id}")
    public R<Boolean> update(@PathVariable Long id, @RequestBody WxUser user) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        user.setId(id);
        return R.success(wxUserService.updateById(user));
    }

    /**
     * 更新小程序用户状态
     */
    @PutMapping("/{id}/status")
    public R<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        return R.success(wxUserService.updateStatus(id, status));
    }

    /**
     * 更新小程序用户会员等级
     */
    @PutMapping("/{id}/level")
    public R<Boolean> updateMemberLevel(@PathVariable Long id, @RequestParam Integer level) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        return R.success(wxUserService.updateMemberLevel(id, level));
    }

    /**
     * 调整小程序用户积分
     */
    @PostMapping("/{id}/points")
    public R<Boolean> adjustPoints(@PathVariable Long id, 
                                   @RequestParam Integer points,
                                   @RequestParam String description) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        return R.success(wxUserService.adjustPoints(id, points, description));
    }

    /**
     * 重置小程序用户密码
     */
    @PutMapping("/{id}/reset-password")
    public R<Boolean> resetPassword(@PathVariable Long id) {
        if (!StpUtil.isLogin()) {
            return R.error("未登录");
        }
        
        return R.success(wxUserService.resetPassword(id));
    }
}