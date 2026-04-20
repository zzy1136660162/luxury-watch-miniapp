package com.luxurywatch.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.luxurywatch.entity.Product;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 商品Mapper接口
 */
public interface ProductMapper extends BaseMapper<Product> {

    /**
     * 分页查询商品列表
     */
    IPage<Product> selectProductPage(Page<Product> page,
                                      @Param("name") String name,
                                      @Param("brand") String brand,
                                      @Param("series") String series,
                                      @Param("category") String category,
                                      @Param("status") Integer status);

    /**
     * 查询所有上架商品
     */
    @Select("SELECT * FROM product WHERE status = 1 AND is_deleted = 0 ORDER BY sort ASC, create_time DESC")
    List<Product> selectAllOnSaleProducts();
}
