package com.luxurywatch.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.luxurywatch.entity.Product;
import com.luxurywatch.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 数据初始化服务 - 确保数据库中有示例数据
 */
@Service
public class DataInitializerService {

    @Autowired
    private ProductMapper productMapper;

    /**
     * 初始化测试数据
     */
    public void initializeTestData() {
        // 检查是否已经有数据
        long count = productMapper.selectCount(null);
        if (count > 0) {
            System.out.println("[DataInitializer] 数据库中已有 " + count + " 条商品数据，跳过初始化");
            return;
        }

        System.out.println("[DataInitializer] 数据库为空，开始初始化测试数据...");

        // 添加测试商品数据
        Product[] products = {
            createProduct("劳力士Submariner潜水表", "劳力士", "Submariner", new BigDecimal("80000.00"), "RLX-SUB-001"),
            createProduct("劳力士Datejust日志型", "劳力士", "Datejust", new BigDecimal("65000.00"), "RLX-DJ-001"),
            createProduct("欧米茄海马300米", "欧米茄", "Seamaster", new BigDecimal("45000.00"), "OM-SEA-001"),
            createProduct("欧米茄超霸登月表", "欧米茄", "Speedmaster", new BigDecimal("55000.00"), "OM-SPD-001"),
            createProduct("天梭力洛克系列", "天梭", "力洛克", new BigDecimal("5000.00"), "TS-LOC-001"),
            createProduct("卡地亚蓝气球", "卡地亚", "蓝气球", new BigDecimal("38000.00"), "CT-BAL-001"),
            createProduct("百达翡丽鹦鹉螺", "百达翡丽", "鹦鹉螺", new BigDecimal("250000.00"), "PP-NAU-001"),
            createProduct("沛纳海Luminor", "沛纳海", "Luminor", new BigDecimal("32000.00"), "PN-LUM-001"),
            createProduct("万国葡萄牙系列", "万国", "葡萄牙", new BigDecimal("48000.00"), "IW-POR-001"),
            createProduct("积家约会系列", "积家", "约会", new BigDecimal("68000.00"), "JA-REN-001"),
        };

        for (Product product : products) {
            productMapper.insert(product);
            System.out.println("[DataInitializer] 已添加商品: " + product.getName());
        }

        System.out.println("[DataInitializer] 测试数据初始化完成，共添加 " + products.length + " 条商品");
    }

    private Product createProduct(String name, String brand, String series, BigDecimal price, String code) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setSeries(series);
        product.setPrice(price);
        product.setStock(10);
        product.setStatus(1);
        product.setCode(code);
        product.setCategory("watch");
        product.setCategoryId(1L);
        product.setCreateTime(LocalDateTime.now());
        product.setUpdateTime(LocalDateTime.now());
        return product;
    }
}
