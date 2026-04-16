package com.luxurywatch.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.luxurywatch.entity.ExchangeRecord;

import java.util.List;
import java.util.Map;

/**
 * 积分兑换记录Service接口
 */
public interface ExchangeRecordService extends IService<ExchangeRecord> {

    /**
     * 获取兑换记录列表
     */
    List<Map<String, Object>> getExchangeRecordList(Long userId, Integer status, String productName, String phone);

    /**
     * 更新兑换状态
     */
    boolean updateStatus(Long id, Integer status);

    /**
     * 批量删除兑换记录
     */
    boolean batchDelete(List<Long> ids);
}
