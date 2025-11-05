package com.example.chapter2.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Value("${upload.path}")
    private  String UPLOAD_DIR;

    /*
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE，如果不规定传递的数据格式为MULTIPART_FORM_DATA_VALUE
    会导致springdoc测试接口时无法上传文件
     */
    @PostMapping(value = "/upload",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Ensure the directory exists
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            // Copy the file to the directory
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/download/")
                    .path(file.getOriginalFilename())
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
//   http://localhost:8080/api/files/download/test.png

    @GetMapping("/download/{filename:.+\\.\\w+}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            Path path = Paths.get(UPLOAD_DIR, filename);
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("File download failed: " + e.getMessage());
        }
    }
}
