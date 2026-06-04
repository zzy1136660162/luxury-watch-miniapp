package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.ExchangeProduct;
import com.luxurywatch.mapper.ExchangeProductMapper;
import com.luxurywatch.service.ExchangeProductService;
import org.springframework.stereotype.Service;

/**
 * 积分兑换商品Service实现类
 */
@Service
public class ExchangeProductServiceImpl extends ServiceImpl<ExchangeProductMapper, ExchangeProduct> implements ExchangeProductService {
}
