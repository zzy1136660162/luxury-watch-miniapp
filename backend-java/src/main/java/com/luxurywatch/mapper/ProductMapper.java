package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 商品 Mapper 接口
 */
@Mapper
public interface ProductMapper extends BaseMapper<Product> {

    /**
     * 分页查询商品列表
     */
    IPage<Product> selectProductPage(Page<Product> page, String name, String brand, String series, String category, Integer status);

    /**
     * 查询所有不同的品牌（已排除已删除）
     */
    @Select("SELECT brand FROM product WHERE (is_deleted = 0 OR is_deleted IS NULL) AND brand IS NOT NULL AND brand != '' GROUP BY brand ORDER BY COUNT(*) DESC")
    List<Map<String, Object>> selectDistinctBrands();

    /**
     * 根据品牌名查询所有不同的系列（已排除已删除）
     */
    @Select("SELECT series FROM product WHERE (is_deleted = 0 OR is_deleted IS NULL) AND series IS NOT NULL AND series != '' GROUP BY series ORDER BY COUNT(*) DESC")
    List<Map<String, Object>> selectDistinctSeries();

    /**
     * 根据品牌名查询所有不同的系列（已排除已删除）
     */
    @Select("SELECT series FROM product WHERE (is_deleted = 0 OR is_deleted IS NULL) AND brand = #{brand} AND series IS NOT NULL AND series != '' GROUP BY series ORDER BY COUNT(*) DESC")
    List<Map<String, Object>> selectDistinctSeriesByBrand(String brand);
}
