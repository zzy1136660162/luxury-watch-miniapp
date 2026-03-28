package com.luxurywatch.vo;

import lombok.Data;

import java.util.List;

/**
 * 登录响应VO
 */
@Data
public class LoginVO {

    /** Token */
    private String token;

    /** 用户信息 */
    private UserInfoVO userInfo;
}
