package com.luxurywatch.vo;

import lombok.Data;

import java.util.List;

/**
 * 权限信息VO
 */
@Data
public class PermissionVO {

    /** 角色列表 */
    private List<String> roles;

    /** 权限标识列表 */
    private List<String> permissions;
}
