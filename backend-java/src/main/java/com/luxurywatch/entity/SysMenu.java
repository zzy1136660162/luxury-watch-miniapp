package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统菜单实体
 */
@Data
@TableName("sys_menu")
public class SysMenu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 父菜单ID: 0-顶级 */
    private Long parentId;

    /** 菜单名称 */
    private String name;

    /** 路由路径 */
    private String path;

    /** 组件路径 */
    private String component;

    /** 菜单图标 */
    private String icon;

    /** 类型: 1-目录 2-菜单 3-按钮 */
    private Integer menuType;

    /** 权限标识(按钮用) */
    private String permission;

    /** 排序号 */
    private Integer sort;

    /** 是否显示: 0-隐藏 1-显示 */
    private Integer visible;

    /** 状态: 0-禁用 1-正常 */
    private Integer status;

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;

    /** 逻辑删除: 0-未删 1-已删 */
    private Integer deleted;
}
