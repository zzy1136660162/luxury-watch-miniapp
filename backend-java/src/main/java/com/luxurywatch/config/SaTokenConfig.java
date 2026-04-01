package com.luxurywatch.config;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.dev33.satoken.stp.StpUtil;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sa-Token 配置类
 */
@Configuration
public class SaTokenConfig implements WebMvcConfigurer {

    /**
     * 注册 Sa-Token 拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
            .addPathPatterns("/**")
            .excludePathPatterns(
                "/admin/login",
                "/admin/logout",
                "/admin/captcha/**",
                "/api/**",
                "/images/**",
                "/error",
                "/favicon.ico",
                "/**/*.html",
                "/**/*.js",
                "/**/*.css",
                "/**/*.png",
                "/**/*.jpg",
                "/**/*.gif",
                "/**/*.svg"
            );
    }
}
