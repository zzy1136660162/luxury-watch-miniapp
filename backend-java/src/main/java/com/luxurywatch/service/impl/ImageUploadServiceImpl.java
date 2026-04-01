package com.luxurywatch.service.impl;

import com.luxurywatch.config.UploadConfig;
import com.luxurywatch.dto.ImageUploadDTO;
import com.luxurywatch.service.ImageUploadService;
import com.luxurywatch.util.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
public class ImageUploadServiceImpl implements ImageUploadService {

    private final UploadConfig uploadConfig;

    public ImageUploadServiceImpl(UploadConfig uploadConfig) {
        this.uploadConfig = uploadConfig;
    }

    @Override
    public ImageUploadDTO uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }

        String originalFilename = file.getOriginalFilename();
        
        if (!FileUtil.isAllowedExtension(originalFilename, 
                uploadConfig.getAllowedExtensions().toArray(new String[0]))) {
            throw new RuntimeException("不支持的文件类型，仅支持：" + 
                    String.join(", ", uploadConfig.getAllowedExtensions()));
        }

        long maxSize = (long) uploadConfig.getMaxFileSize() * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new RuntimeException("文件大小超过限制，最大支持 " + uploadConfig.getMaxFileSize() + "MB");
        }

        String subDirectory = FileUtil.generateSubDirectory();
        String uniqueFilename = FileUtil.generateUniqueFilename(originalFilename);
        
        String relativePath = subDirectory + "/" + uniqueFilename;
        
        String rootPath = uploadConfig.getImagePath();
        if (!rootPath.endsWith("/")) {
            rootPath = rootPath + "/";
        }
        
        String fullDirectory = rootPath + subDirectory;
        File directory = new File(fullDirectory);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            log.info("创建上传目录: {}, 结果: {}", fullDirectory, created);
        }

        String fullPath = fullDirectory + "/" + uniqueFilename;
        File destFile = new File(fullPath);
        
        try {
            file.transferTo(destFile);
            log.info("文件上传成功: {}", fullPath);
        } catch (IOException e) {
            log.error("文件保存失败: {}", fullPath, e);
            throw new RuntimeException("文件保存失败：" + e.getMessage());
        }

        String accessUrl = uploadConfig.getBaseUrl() + "/" + relativePath;
        
        ImageUploadDTO result = new ImageUploadDTO();
        result.setUrl(accessUrl);
        result.setFilename(uniqueFilename);
        result.setSize(file.getSize());
        result.setUploadTime(LocalDateTime.now());
        result.setOriginalFilename(originalFilename);
        result.setFileType(FileUtil.getFileExtension(originalFilename));
        
        return result;
    }

    @Override
    public List<ImageUploadDTO> uploadImages(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new RuntimeException("上传文件不能为空");
        }
        
        List<ImageUploadDTO> results = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (int i = 0; i < files.length; i++) {
            try {
                MultipartFile file = files[i];
                if (file != null && !file.isEmpty()) {
                    ImageUploadDTO result = uploadImage(file);
                    results.add(result);
                }
            } catch (Exception e) {
                log.error("第 {} 个文件上传失败: {}", i + 1, e.getMessage());
                errors.add("第 " + (i + 1) + " 个文件上传失败: " + e.getMessage());
            }
        }
        
        if (!errors.isEmpty() && results.isEmpty()) {
            throw new RuntimeException("所有文件上传失败：" + String.join("; ", errors));
        }
        
        if (!errors.isEmpty()) {
            log.warn("部分文件上传失败: {}", String.join("; ", errors));
        }
        
        return results;
    }
}
