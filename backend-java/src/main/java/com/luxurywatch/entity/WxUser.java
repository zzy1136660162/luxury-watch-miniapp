package com.luxurywatch.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("wx_user")
public class WxUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String nickname;

    private String phone;

    private String avatar;

    private Integer points;

    private Integer memberLevel;

    private LocalDate birthday;

    private Integer gender;

    private Integer status;

    private LocalDateTime lastLoginTime;

    private String lastLoginIp;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;

    private Integer deleted;
}