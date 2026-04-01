package com.luxurywatch.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MiniLoginRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    private String username;

    private String password;

    private String avatar;

    private String nickname;
}
