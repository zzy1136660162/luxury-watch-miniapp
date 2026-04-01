package com.luxurywatch.controller;

import com.luxurywatch.common.R;
import com.luxurywatch.dto.ImageUploadDTO;
import com.luxurywatch.service.ImageUploadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping("/image")
    public R<ImageUploadDTO> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            log.info("接收到图片上传请求: {}", file.getOriginalFilename());
            ImageUploadDTO result = imageUploadService.uploadImage(file);
            log.info("图片上传成功: {}", result.getUrl());
            return R.success(result);
        } catch (Exception e) {
            log.error("图片上传失败: {}", e.getMessage(), e);
            return R.error(e.getMessage());
        }
    }

    @PostMapping("/images")
    public R<Map<String, Object>> uploadImages(@RequestParam("files") MultipartFile[] files) {
        try {
            log.info("接收到批量图片上传请求，数量: {}", files.length);
            List<ImageUploadDTO> results = imageUploadService.uploadImages(files);
            
            Map<String, Object> data = new HashMap<>();
            data.put("urls", results.stream().map(ImageUploadDTO::getUrl).collect(Collectors.toList()));
            data.put("count", results.size());
            data.put("details", results);
            
            log.info("批量图片上传成功: {} 个文件", results.size());
            return R.success(data);
        } catch (Exception e) {
            log.error("批量图片上传失败: {}", e.getMessage(), e);
            return R.error(e.getMessage());
        }
    }
}
