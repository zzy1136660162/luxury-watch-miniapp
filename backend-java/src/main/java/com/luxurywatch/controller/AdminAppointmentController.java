package com.luxurywatch.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.common.R;
import com.luxurywatch.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * 管理平台预约控制器
 */
@RestController
@RequestMapping("/admin/appointment")
public class AdminAppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    /**
     * 获取预约列表
     */
    @GetMapping("/list")
    @SaCheckPermission("appointment:list")
    public R<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Integer status) {
        
        IPage<Map<String, Object>> appointmentPage = appointmentService.getAppointmentPage(page, size, status);
        
        Map<String, Object> result = new HashMap<>();
        result.put("list", appointmentPage.getRecords());
        result.put("total", appointmentPage.getTotal());
        result.put("page", appointmentPage.getCurrent());
        result.put("size", appointmentPage.getSize());
        
        return R.success(result);
    }

    /**
     * 确认到店
     */
    @PutMapping("/{id}/confirm")
    @SaCheckPermission("appointment:confirm")
    public R<String> confirm(@PathVariable Long id) {
        boolean success = appointmentService.confirmArrival(id);
        if (success) {
            return R.success("操作成功");
        }
        return R.error("操作失败");
    }
}
