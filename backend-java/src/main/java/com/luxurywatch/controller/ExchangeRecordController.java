package com.luxurywatch.controller;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.common.PageResult;
import com.luxurywatch.common.R;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.service.ExchangeRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 积分兑换记录控制器
 */
@RestController
@RequestMapping("/order")
public class ExchangeRecordController {

    @Autowired
    private ExchangeRecordService exchangeRecordService;

    /**
     * 获取兑换记录列表（分页）
     */
    @GetMapping("/list")
    public R<PageResult<Map<String, Object>>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String phone) {

        // 创建分页对象
        Page<ExchangeRecord> pageParam = new Page<>(page, size);

        // 构建查询条件
        LambdaQueryWrapper<ExchangeRecord> wrapper = new LambdaQueryWrapper<>();

        if (userId != null) {
            wrapper.eq(ExchangeRecord::getUserId, userId);
        }
        if (status != null) {
            wrapper.eq(ExchangeRecord::getStatus, status);
        }
        if (productName != null && !productName.trim().isEmpty()) {
            wrapper.like(ExchangeRecord::getProductName, productName);
        }
        if (phone != null && !phone.trim().isEmpty()) {
            wrapper.eq(ExchangeRecord::getPhone, phone);
        }

        // 执行分页查询
        Page<ExchangeRecord> resultPage = exchangeRecordService.page(pageParam, wrapper);

        // 转换为Map列表
        List<Map<String, Object>> list = resultPage.getRecords().stream().map(record -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", record.getId());
            map.put("userId", record.getUserId());
            map.put("userName", record.getUserName());
            map.put("productId", record.getProductId());
            map.put("productName", record.getProductName());
            map.put("productImage", record.getProductImage());
            map.put("points", record.getPoints());
            map.put("phone", record.getPhone());
            map.put("address", record.getAddress());
            map.put("status", record.getStatus());
            map.put("exchangeTime", record.getExchangeTime());
            return map;
        }).collect(Collectors.toList());

        // 构建分页结果
        PageResult<Map<String, Object>> result = new PageResult<>(list, resultPage.getTotal(), page, size);

        return R.success(result);
    }

    /**
     * 获取兑换记录详情
     */
    @GetMapping("/{id}")
    public R<Map<String, Object>> detail(@PathVariable Long id) {
        ExchangeRecord record = exchangeRecordService.getById(id);
        if (record == null) {
            return R.error("记录不存在");
        }

        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", record.getId());
        map.put("userId", record.getUserId());
        map.put("userName", record.getUserName());
        map.put("productId", record.getProductId());
        map.put("productName", record.getProductName());
        map.put("productImage", record.getProductImage());
        map.put("points", record.getPoints());
        map.put("phone", record.getPhone());
        map.put("address", record.getAddress());
        map.put("status", record.getStatus());
        map.put("exchangeTime", record.getExchangeTime());

        return R.success(map);
    }

    /**
     * 更新兑换状态
     */
    @PutMapping("/{id}/status")
    public R<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        Integer status = params.get("status");
        if (status == null) {
            return R.error("状态不能为空");
        }

        ExchangeRecord record = exchangeRecordService.getById(id);
        if (record == null) {
            return R.error("记录不存在");
        }
        record.setStatus(status);
        boolean success = exchangeRecordService.updateById(record);
        if (success) {
            return R.success();
        } else {
            return R.error("更新失败");
        }
    }

    /**
     * 批量更新状态
     */
    @PutMapping("/batch-status")
    public R<Void> batchUpdateStatus(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Long> ids = (List<Long>) params.get("ids");
        Integer status = (Integer) params.get("status");

        if (ids == null || ids.isEmpty() || status == null) {
            return R.error("参数不能为空");
        }

        for (Long id : ids) {
            ExchangeRecord record = exchangeRecordService.getById(id);
            if (record != null) {
                record.setStatus(status);
                exchangeRecordService.updateById(record);
            }
        }

        return R.success();
    }

    /**
     * 删除兑换记录
     */
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = exchangeRecordService.removeById(id);
        if (success) {
            return R.success();
        } else {
            return R.error("删除失败");
        }
    }

    /**
     * 批量删除兑换记录
     */
    @PostMapping("/batch-delete")
    public R<Void> batchDelete(@RequestBody Map<String, List<Long>> params) {
        List<Long> ids = params.get("ids");
        if (ids == null || ids.isEmpty()) {
            return R.error("ID列表不能为空");
        }

        boolean success = exchangeRecordService.removeByIds(ids);
        if (success) {
            return R.success();
        } else {
            return R.error("删除失败");
        }
    }
}
