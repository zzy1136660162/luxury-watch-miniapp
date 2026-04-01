package com.luxurywatch.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadDTO {
    
    private String url;
    
    private String filename;
    
    private Long size;
    
    private LocalDateTime uploadTime;
    
    private String originalFilename;
    
    private String fileType;
}
