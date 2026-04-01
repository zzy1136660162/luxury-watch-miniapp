package com.luxurywatch.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "upload")
public class UploadConfig {
    
    private String imagePath;
    
    private List<String> allowedExtensions;
    
    private Integer maxFileSize;
    
    private String baseUrl;
}
