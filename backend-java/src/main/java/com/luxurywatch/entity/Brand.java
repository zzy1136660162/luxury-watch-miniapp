package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 品牌实体类
 */
@Data
@TableName("brand")
public class Brand {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 品牌名称
     */
    private String name;

    /**
     * 品牌Logo
     */
    private String logo;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
