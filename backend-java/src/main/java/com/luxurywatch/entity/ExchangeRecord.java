package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 积分兑换记录实体类
 */
@Data
@TableName("exchange_record")
public class ExchangeRecord {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 用户名称
     */
    @TableField("user_name")
    private String userName;

    /**
     * 商品ID
     */
    @TableField("product_id")
    private Long productId;

    /**
     * 商品名称
     */
    @TableField("product_name")
    private String productName;

    /**
     * 商品图片
     */
    @TableField("product_image")
    private String productImage;

    /**
     * 消耗积分
     */
    @TableField("points")
    private Integer points;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 兑换时间
     */
    @TableField("exchange_time")
    private LocalDateTime exchangeTime;

    /**
     * 兑换状态：0-待处理，1-已完成，2-已取消
     */
    private Integer status;
}
