package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品信息实体类
 */
@Data
@TableName("product")
public class Product {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    @TableField("name_en")
    private String nameEn;

    private String intro;

    private String code;

    @TableField("category_id")
    private Long categoryId;

    private String category;

    /**
     * 品牌（如：劳力士、欧米茄、天梭等）
     */
    private String brand;

    private String image;

    private String images;

    private BigDecimal price;

    @TableField("original_price")
    private BigDecimal originalPrice;

    private Integer stock;

    private Integer sales;

    private Integer status;

    private Integer sort;

    private String description;

    private String content;

    /**
     * 动力储存（如：72小时）
     */
    @TableField("power_reserve")
    private String powerReserve;

    /**
     * 防水性能（米），可选值：25, 50, 100, 150
     */
    @TableField("water_resistance")
    private Integer waterResistance;

    /**
     * 表壳尺寸（如：40毫米/10毫米厚度）
     */
    @TableField("case_size")
    private String caseSize;

    /**
     * 材质（如：18K玫瑰金、蓝宝石水晶玻璃）
     */
    private String material;

    /**
     * 表带材质（如：真皮表带、钢带、橡胶表带）
     */
    private String strap;

    /**
     * 是否可用积分兑换：0-否，1-是
     */
    @TableField("can_redeem_points")
    private Integer canRedeemPoints;

    /**
     * 积分兑换所需积分
     */
    @TableField("points_cost")
    private Integer pointsCost;

    /**
     * 品牌故事（富文本 HTML）
     */
    private String brandStory;

    @TableLogic
    @TableField("is_deleted")
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
