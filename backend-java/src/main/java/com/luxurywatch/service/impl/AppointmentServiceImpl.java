package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.entity.Appointment;
import com.luxurywatch.entity.Store;
import com.luxurywatch.entity.WxUser;
import com.luxurywatch.mapper.AppointmentMapper;
import com.luxurywatch.mapper.StoreMapper;
import com.luxurywatch.mapper.WxUserMapper;
import com.luxurywatch.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 预约服务实现
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentMapper appointmentMapper;

    @Autowired
    private StoreMapper storeMapper;

    @Autowired
    private WxUserMapper wxUserMapper;

    @Override
    public IPage<Map<String, Object>> getAppointmentPage(Integer page, Integer size, Integer status) {
        Page<Appointment> appointmentPage = new Page<>(page, size);
        QueryWrapper<Appointment> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0);
        if (status != null) {
            wrapper.eq("status", status);
        }
        wrapper.orderByDesc("create_time");
        
        Page<Appointment> result = appointmentMapper.selectPage(appointmentPage, wrapper);
        
        List<Appointment> appointments = result.getRecords();
        List<Long> userIds = appointments.stream().map(Appointment::getUserId).distinct().collect(Collectors.toList());
        List<Long> storeIds = appointments.stream().map(Appointment::getStoreId).distinct().collect(Collectors.toList());
        
        Map<Long, WxUser> userMap = new HashMap<>();
        if (!userIds.isEmpty()) {
            List<WxUser> users = wxUserMapper.selectBatchIds(userIds);
            userMap = users.stream().collect(Collectors.toMap(WxUser::getId, u -> u));
        }
        
        Map<Long, Store> storeMap = new HashMap<>();
        if (!storeIds.isEmpty()) {
            List<Store> stores = storeMapper.selectBatchIds(storeIds);
            storeMap = stores.stream().collect(Collectors.toMap(Store::getId, s -> s));
        }
        
        List<Map<String, Object>> records = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM月dd日");
        for (Appointment appt : appointments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", appt.getId());
            map.put("userId", appt.getUserId());
            map.put("storeId", appt.getStoreId());
            map.put("appointmentDate", appt.getAppointmentDate());
            map.put("appointmentTime", appt.getAppointmentTime());
            map.put("status", appt.getStatus());
            map.put("remark", appt.getRemark());
            map.put("createTime", appt.getCreateTime());
            
            if (appt.getAppointmentDate() != null) {
                map.put("appointmentDateDisplay", appt.getAppointmentDate().format(dateFormatter));
            }
            
            String[] statusText = {"正常", "已完成", "已取消"};
            map.put("statusText", statusText[appt.getStatus()]);
            
            WxUser user = userMap.get(appt.getUserId());
            if (user != null) {
                map.put("userName", user.getUsername());
                String phone = user.getPhone();
                if (phone != null && phone.length() >= 11) {
                    map.put("userPhone", phone.substring(0, 3) + "****" + phone.substring(7));
                } else {
                    map.put("userPhone", phone);
                }
            }
            
            Store store = storeMap.get(appt.getStoreId());
            if (store != null) {
                map.put("storeName", store.getName());
                map.put("storeAddress", store.getAddress());
            }
            
            records.add(map);
        }
        
        Page<Map<String, Object>> resultPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        resultPage.setRecords(records);
        return resultPage;
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentMapper.selectById(id);
    }

    @Override
    public boolean createAppointment(Appointment appointment) {
        appointment.setStatus(0);
        return appointmentMapper.insert(appointment) > 0;
    }

    @Override
    public boolean confirmArrival(Long id) {
        Appointment appointment = new Appointment();
        appointment.setId(id);
        appointment.setStatus(1);
        return appointmentMapper.updateById(appointment) > 0;
    }

    @Override
    public boolean cancelAppointment(Long id, Long userId) {
        Appointment appointment = appointmentMapper.selectById(id);
        if (appointment == null || !appointment.getUserId().equals(userId) || appointment.getStatus() != 0) {
            return false;
        }
        appointment.setStatus(2);
        return appointmentMapper.updateById(appointment) > 0;
    }

    @Override
    public List<Map<String, Object>> getUserAppointments(Long userId) {
        IPage<Map<String, Object>> page = getUserAppointmentPage(userId, 1, 100);
        return page.getRecords();
    }

    @Override
    public IPage<Map<String, Object>> getUserAppointmentPage(Long userId, Integer page, Integer size) {
        Page<Appointment> appointmentPage = new Page<>(page, size);
        QueryWrapper<Appointment> wrapper = new QueryWrapper<>();
        wrapper.eq("deleted", 0).eq("user_id", userId).orderByDesc("create_time");
        
        Page<Appointment> result = appointmentMapper.selectPage(appointmentPage, wrapper);
        List<Appointment> appointments = result.getRecords();
        
        List<Long> storeIds = appointments.stream().map(Appointment::getStoreId).collect(Collectors.toList());
        Map<Long, Store> storeMap = new HashMap<>();
        if (!storeIds.isEmpty()) {
            List<Store> stores = storeMapper.selectBatchIds(storeIds);
            storeMap = stores.stream().collect(Collectors.toMap(Store::getId, s -> s));
        }
        
        List<Map<String, Object>> records = new ArrayList<>();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM月dd日");
        for (Appointment appt : appointments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", appt.getId());
            map.put("appointmentDate", appt.getAppointmentDate().format(dateFormatter));
            map.put("appointmentTime", appt.getAppointmentTime());
            map.put("status", appt.getStatus());
            
            String[] statusText = {"待到店", "已完成", "已取消"};
            map.put("statusText", statusText[appt.getStatus()]);
            
            Store store = storeMap.get(appt.getStoreId());
            if (store != null) {
                map.put("storeName", store.getName());
                map.put("storeAddress", store.getAddress());
            }
            
            records.add(map);
        }
        
        Page<Map<String, Object>> resultPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
        resultPage.setRecords(records);
        return resultPage;
    }
}
