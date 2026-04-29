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
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public IPage<Product> getProductPage(Integer page, Integer size, String name, String brand, String series, String category, Integer status) {
        Page<Product> pageParam = new Page<>(page, size);
        return baseMapper.selectProductPage(pageParam, name, brand, series, category, status);
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
     * 搜索品牌列表（用于Autocomplete）
     * 返回品牌名称和该品牌下的商品数量
     * 支持根据query模糊搜索
     */
    public List<Map<String, Object>> searchBrands(String query) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            // 使用原生SQL查询所有不同的品牌
            List<Map<String, Object>> brands = baseMapper.selectDistinctBrands();
            
            for (Map<String, Object> brandMap : brands) {
                String brandName = (String) brandMap.get("brand");
                
                // 如果有查询条件，进行模糊匹配
                if (StringUtils.hasText(query) && !brandName.toLowerCase().contains(query.toLowerCase())) {
                    continue;
                }
                
                // 统计该品牌的商品数量
                Long count = baseMapper.selectCount(
                    new LambdaQueryWrapper<Product>()
                        .eq(Product::getBrand, brandName)
                        .eq(Product::getIsDeleted, 0)
                );

                Map<String, Object> item = new HashMap<>();
                item.put("name", brandName);
                item.put("count", count.intValue());
                result.add(item);
            }
        } catch (Exception e) {
            System.err.println("[ProductService] searchBrands error: " + e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 搜索系列列表（用于Autocomplete）
     * 如果传入品牌，则筛选该品牌下的系列
     * 如果不传品牌，则搜索所有系列
     * 支持根据query模糊搜索
     */
    public List<Map<String, Object>> searchSeries(String brand, String query) {
        List<Map<String, Object>> result = new ArrayList<>();
        
        try {
            List<Map<String, Object>> seriesList;
            
            // 如果有品牌条件，使用品牌筛选的查询
            if (StringUtils.hasText(brand)) {
                seriesList = baseMapper.selectDistinctSeriesByBrand(brand);
            } else {
                // 否则查询所有系列
                seriesList = baseMapper.selectDistinctSeries();
            }
            
            for (Map<String, Object> seriesMap : seriesList) {
                String seriesName = (String) seriesMap.get("series");
                
                // 如果有查询条件，进行模糊匹配
                if (StringUtils.hasText(query) && !seriesName.toLowerCase().contains(query.toLowerCase())) {
                    continue;
                }
                
                // 统计该系列的商品数量
                LambdaQueryWrapper<Product> countWrapper = new LambdaQueryWrapper<>();
                countWrapper.eq(Product::getSeries, seriesName)
                           .eq(Product::getIsDeleted, 0);
                
                // 如果有品牌筛选条件，也添加到计数查询中
                if (StringUtils.hasText(brand)) {
                    countWrapper.eq(Product::getBrand, brand);
                }
                
                Long count = baseMapper.selectCount(countWrapper);

                Map<String, Object> item = new HashMap<>();
                item.put("name", seriesName);
                item.put("count", count.intValue());
                result.add(item);
            }
        } catch (Exception e) {
            System.err.println("[ProductService] searchSeries error: " + e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    /**
     * 根据品牌和系列名从系列表查询Logo
     */
    public String getSeriesLogo(String brand, String series) {
        // 先查找品牌ID
        List<Brand> brands = brandMapper.selectList(
                new LambdaQueryWrapper<Brand>().eq(Brand::getName, brand)
        );
        if (brands.isEmpty()) {
            return null;
        }
        Integer brandId = brands.get(0).getId();

        // 再查找系列Logo
        List<Series> seriesList = seriesMapper.selectList(
                new LambdaQueryWrapper<Series>()
                        .eq(Series::getBrandId, brandId)
                        .eq(Series::getName, series)
                        .isNotNull(Series::getLogo)
                        .ne(Series::getLogo, "")
        );

        return seriesList.isEmpty() ? null : seriesList.get(0).getLogo();
    }

    /**
     * 检查品牌是否存在
     */
    public boolean existsByBrand(String brand) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getBrand, brand);
        return baseMapper.selectCount(wrapper) > 0;
    }

    /**
     * 从品牌表获取品牌图片
     */
    public String getBrandImage(String brand) {
        List<Brand> brands = brandMapper.selectList(
                new LambdaQueryWrapper<Brand>()
                        .eq(Brand::getName, brand)
                        .isNotNull(Brand::getLogo)
                        .ne(Brand::getLogo, "")
        );
        return brands.isEmpty() ? null : brands.get(0).getLogo();
    }
}
