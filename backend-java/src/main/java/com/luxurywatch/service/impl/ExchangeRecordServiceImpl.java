package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.ExchangeRecord;
import com.luxurywatch.mapper.ExchangeRecordMapper;
import com.luxurywatch.service.ExchangeRecordService;
import org.springframework.stereotype.Service;

/**
 * 积分兑换记录Service实现类
 */
@Service
public class ExchangeRecordServiceImpl extends ServiceImpl<ExchangeRecordMapper, ExchangeRecord> implements ExchangeRecordService {
}
