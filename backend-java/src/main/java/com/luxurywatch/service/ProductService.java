package com.luxurywatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.luxurywatch.entity.Brand;
import com.luxurywatch.entity.Product;
import com.luxurywatch.entity.Series;
import com.luxurywatch.mapper.BrandMapper;
import com.luxurywatch.mapper.ProductMapper;
import com.luxurywatch.mapper.SeriesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 商品服务类
 */
@Service
public class ProductService extends ServiceImpl<ProductMapper, Product> {

    @Autowired
    private BrandMapper brandMapper;

    @Autowired
    private SeriesMapper seriesMapper;

    /**
     * 分页查询商品列表
     */
    public IPage<Product> getProductPage(Integer page, Integer size, String name, String brand, String category, Integer status) {
        Page<Product> pageParam = new Page<>(page, size);
        return baseMapper.selectProductPage(pageParam, name, brand, category, status);
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

    /**
     * 获取所有品牌列表（用于前端下拉选择）
     */
    public List<Brand> getAllBrands() {
        return brandMapper.selectList(null);
    }

    /**
     * 根据品牌ID获取系列列表
     */
    public List<Series> getSeriesByBrandId(Integer brandId) {
        LambdaQueryWrapper<Series> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Series::getBrandId, brandId);
        return seriesMapper.selectList(wrapper);
    }

    /**
     * 根据品牌和系列名查询已存在的系列Logo
     * 如果存在多个，返回第一个
     */
    public String getSeriesLogo(String brand, String series) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getBrand, brand)
               .eq(Product::getSeries, series)
               .isNotNull(Product::getSeriesLogo)
               .ne(Product::getSeriesLogo, "")
               .orderByDesc(Product::getId)  // 最新添加的优先
               .last("LIMIT 1");
        
        Product product = baseMapper.selectOne(wrapper);
        return product != null ? product.getSeriesLogo() : null;
    }
}
