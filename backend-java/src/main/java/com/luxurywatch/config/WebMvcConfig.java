package com.luxurywatch.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final UploadConfig uploadConfig;

    public WebMvcConfig(UploadConfig uploadConfig) {
        this.uploadConfig = uploadConfig;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String imagePath = uploadConfig.getImagePath();
        
        if (!imagePath.endsWith("/")) {
            imagePath = imagePath + "/";
        }
        
        // 同时映射 /api/images/** 和 /images/** 到图片存储目录
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:" + imagePath);
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + imagePath);
        
        System.out.println("===== 图片静态资源映射配置 =====");
        System.out.println("映射路径: /api/images/** 和 /images/**");
        System.out.println("物理路径: " + imagePath);
        System.out.println("访问示例: http://localhost:8081/api/images/heroImage.jpg");
        System.out.println("================================");
    }
}
