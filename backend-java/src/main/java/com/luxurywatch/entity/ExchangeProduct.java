package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 积分兑换商品实体类
 */
@Data
@TableName("exchange_product")
public class ExchangeProduct {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 商品名称
     */
    private String name;

    /**
     * 商品编码
     */
    private String code;

    /**
     * 商品图片，多个用逗号分隔
     */
    private String image;

    /**
     * 所需积分
     */
    private Integer pointsCost;

    /**
     * 库存数量
     */
    private Integer stock;

    /**
     * 商品描述
     */
    private String description;

    /**
     * 状态：0-下架，1-上架
     */
    private Integer status;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

}
