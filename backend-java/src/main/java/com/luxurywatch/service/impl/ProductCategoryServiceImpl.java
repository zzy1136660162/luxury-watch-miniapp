package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.ProductCategory;
import com.luxurywatch.mapper.ProductCategoryMapper;
import com.luxurywatch.service.ProductCategoryService;
import org.springframework.stereotype.Service;

/**
 * 商品分类服务实现类
 */
@Service
public class ProductCategoryServiceImpl extends ServiceImpl<ProductCategoryMapper, ProductCategory> implements ProductCategoryService {
}
