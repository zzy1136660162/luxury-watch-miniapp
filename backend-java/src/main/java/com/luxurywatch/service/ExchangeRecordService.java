package com.luxurywatch.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.mapper.ExchangeRecordMapper;
import org.springframework.stereotype.Service;

/**
 * 积分兑换记录服务类
 */
@Service
public class ExchangeRecordService extends ServiceImpl<ExchangeRecordMapper, ExchangeRecord> {

    /**
     * 创建兑换记录
     */
    public boolean createExchangeRecord(ExchangeRecord record) {
        return save(record);
    }
}
