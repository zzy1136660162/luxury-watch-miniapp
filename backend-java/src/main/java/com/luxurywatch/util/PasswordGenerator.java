package com.luxurywatch.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 密码生成工具
 */
public class PasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 生成密码哈希
        String password = "admin123";
        String encodedPassword = encoder.encode(password);

        System.out.println("========================================");
        System.out.println("原始密码: " + password);
        System.out.println("BCrypt哈希: " + encodedPassword);
        System.out.println("========================================");

        // 验证密码
        boolean matches = encoder.matches(password, encodedPassword);
        System.out.println("验证结果: " + (matches ? "通过" : "失败"));
    }
}
