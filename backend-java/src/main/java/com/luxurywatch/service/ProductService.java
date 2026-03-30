package com.luxurywatch.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.Product;
import com.luxurywatch.mapper.ProductMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 商品服务类
 */
@Service
public class ProductService extends ServiceImpl<ProductMapper, Product> {

    /**
     * 分页查询商品列表
     */
    public IPage<Product> getProductPage(Integer page, Integer size, String name, String category, Integer status) {
        Page<Product> pageParam = new Page<>(page, size);
        return baseMapper.selectProductPage(pageParam, name, category, status);
    }

    /**
     * 根据ID查询商品
     */
    public Product getProductById(Long id) {
        return getById(id);
    }

    /**
     * 创建商品
     */
    public boolean createProduct(Product product) {
        return save(product);
    }

    /**
     * 更新商品
     */
    public boolean updateProduct(Product product) {
        return updateById(product);
    }

    /**
     * 删除商品
     */
    public boolean deleteProduct(Long id) {
        return removeById(id);
    }

    /**
     * 批量删除商品
     */
    public boolean batchDeleteProducts(List<Long> ids) {
        return removeByIds(ids);
    }

    /**
     * 更新商品状态
     */
    public boolean updateProductStatus(Long id, Integer status) {
        Product product = new Product();
        product.setId(id);
        product.setStatus(status);
        return updateById(product);
    }

    /**
     * 更新商品库存
     */
    public boolean updateProductStock(Long id, Integer stock) {
        Product product = new Product();
        product.setId(id);
        product.setStock(stock);
        return updateById(product);
    }
}
