package com.luxurywatch.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class FileUtil {
    
    private static final DateTimeFormatter YEAR_MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    
    public static String generateSubDirectory() {
        return LocalDateTime.now().format(YEAR_MONTH_FORMATTER);
    }
    
    public static String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        
        if (extension != null && !extension.isEmpty()) {
            return timestamp + "_" + uuid + "." + extension;
        } else {
            return timestamp + "_" + uuid;
        }
    }
    
    public static String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
    
    public static boolean isAllowedExtension(String filename, String[] allowedExtensions) {
        String extension = getFileExtension(filename);
        for (String allowed : allowedExtensions) {
            if (allowed.equalsIgnoreCase(extension)) {
                return true;
            }
        }
        return false;
    }
}
