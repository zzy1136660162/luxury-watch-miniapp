package com.luxurywatch.service;

import com.luxurywatch.dto.ImageUploadDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageUploadService {
    
    ImageUploadDTO uploadImage(MultipartFile file);
    
    List<ImageUploadDTO> uploadImages(MultipartFile[] files);

    ImageUploadDTO uploadVideo(MultipartFile file);
}
