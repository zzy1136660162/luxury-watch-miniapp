package com.luxurywatch.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.luxurywatch.entity.Appointment;
import java.util.List;
import java.util.Map;

/**
 * 预约服务接口
 */
public interface AppointmentService {

    /**
     * 获取预约列表（管理平台用）
     */
    IPage<Map<String, Object>> getAppointmentPage(Integer page, Integer size, Integer status);

    /**
     * 根据ID获取预约
     */
    Appointment getAppointmentById(Long id);

    /**
     * 创建预约
     */
    boolean createAppointment(Appointment appointment);

    /**
     * 确认到店
     */
    boolean confirmArrival(Long id);

    /**
     * 取消预约
     */
    boolean cancelAppointment(Long id, Long userId);

    /**
     * 获取用户的预约列表（小程序用）
     */
    List<Map<String, Object>> getUserAppointments(Long userId);

    /**
     * 获取用户的预约列表（分页）
     */
    IPage<Map<String, Object>> getUserAppointmentPage(Long userId, Integer page, Integer size);
}
