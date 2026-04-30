package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系列实体类
 */
@Data
@TableName("series")
public class Series {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 所属品牌ID
     */
    @TableField("brand_id")
    private Integer brandId;

    /**
     * 系列名称
     */
    private String name;

    /**
     * 系列Logo
     */
    private String logo;

    /**
     * 系列介绍视频URL
     */
    @TableField("video_url")
    private String videoUrl;

    /**
     * 系列介绍富文本
     */
    private String content;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
