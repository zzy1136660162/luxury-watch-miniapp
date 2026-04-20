package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.Appointment;
import com.luxurywatch.service.AppointmentService;
import com.luxurywatch.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 小程序预约控制器
 */
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private StoreService storeService;

    /**
     * 获取门店列表
     */
    @GetMapping("/stores")
    public R<List<Map<String, Object>>> getStores() {
        List<Map<String, Object>> stores = storeService.getAllActiveStores().stream().map(store -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", store.getId());
            map.put("name", store.getName());
            map.put("address", store.getAddress());
            return map;
        }).collect(Collectors.toList());
        return R.success(stores);
    }

    /**
     * 创建预约
     */
    @PostMapping
    public R<String> create(@RequestBody Map<String, Object> params) {
        Object loginId = StpUtil.getLoginId();
        if (loginId == null) {
            return R.error("请先登录");
        }
        
        Long userId = Long.valueOf(loginId.toString());
        Long storeId = Long.valueOf(params.get("storeId").toString());
        String appointmentDate = params.get("appointmentDate").toString();
        String appointmentTime = params.get("appointmentTime").toString();
        String remark = params.getOrDefault("remark", "").toString();
        
        Appointment appointment = new Appointment();
        appointment.setUserId(userId);
        appointment.setStoreId(storeId);
        appointment.setAppointmentDate(java.time.LocalDate.parse(appointmentDate));
        appointment.setAppointmentTime(appointmentTime);
        appointment.setRemark(remark);
        
        boolean success = appointmentService.createAppointment(appointment);
        if (success) {
            return R.success("预约成功");
        }
        return R.error("预约失败");
    }

    /**
     * 获取我的预约列表
     */
    @GetMapping("/my")
    public R<List<Map<String, Object>>> getMyAppointments() {
        Object loginId = StpUtil.getLoginId();
        if (loginId == null) {
            return R.error("请先登录");
        }
        
        Long userId = Long.valueOf(loginId.toString());
        List<Map<String, Object>> appointments = appointmentService.getUserAppointments(userId);
        return R.success(appointments);
    }

    /**
     * 取消预约
     */
    @PutMapping("/{id}/cancel")
    public R<String> cancel(@PathVariable Long id) {
        Object loginId = StpUtil.getLoginId();
        if (loginId == null) {
            return R.error("请先登录");
        }
        
        Long userId = Long.valueOf(loginId.toString());
        boolean success = appointmentService.cancelAppointment(id, userId);
        if (success) {
            return R.success("取消成功");
        }
        return R.error("取消失败");
    }
}
