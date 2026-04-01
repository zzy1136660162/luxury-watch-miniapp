package com.luxurywatch.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MiniLoginResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String username;

    private String avatar;

    private Integer points;

    private Integer growthValue;

    private Integer memberLevel;

    private String memberLevelName;

    private String token;
}
