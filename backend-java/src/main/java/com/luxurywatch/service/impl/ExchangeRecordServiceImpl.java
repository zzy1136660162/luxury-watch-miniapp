package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.mapper.ExchangeRecordMapper;
import com.luxurywatch.service.ExchangeRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 积分兑换记录Service实现类
 */
@Service
public class ExchangeRecordServiceImpl extends ServiceImpl<ExchangeRecordMapper, ExchangeRecord> implements ExchangeRecordService {

    @Autowired
    private ExchangeRecordMapper exchangeRecordMapper;

    @Override
    public List<Map<String, Object>> getExchangeRecordList(Long userId, Integer status, String productName, String phone) {
        return exchangeRecordMapper.selectByCondition(userId, status, productName, phone);
    }

    @Override
    public boolean updateStatus(Long id, Integer status) {
        ExchangeRecord record = new ExchangeRecord();
        record.setId(id);
        record.setStatus(status);
        return updateById(record);
    }

    @Override
    public boolean batchDelete(List<Long> ids) {
        return removeByIds(ids);
    }
}
