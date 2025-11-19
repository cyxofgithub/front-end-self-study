package com.example.film_review.service;

import com.example.film_review.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    // 使用配置文件中的路径
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().
                normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            // 使用自定义异常替代 RuntimeException
            throw new FileStorageException("无法创建用于存储上传文件的目录。", ex);
        }
    }
    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                // 使用自定义异常替代 RuntimeException
                throw new FileStorageException("文件名包含非法路径序列：" +
                        fileName);
            }
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation,
                    StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            // 使用自定义异常替代 RuntimeException
            throw new FileStorageException("无法存储文件 " + fileName + "，请重试。", ex);
        }
    }
}
