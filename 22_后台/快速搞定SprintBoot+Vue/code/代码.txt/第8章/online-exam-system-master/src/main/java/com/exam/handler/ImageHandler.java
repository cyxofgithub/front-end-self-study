package com.exam.handler;

import com.exam.utils.LogicException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

@ControllerAdvice
public class ImageHandler {
    static Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    @Value("${file.upload.path}")
    private String path;

    public String upLoad (MultipartFile file) {

        if (file.isEmpty()) {
            throw new LogicException("500", "文件为空！");
        }
        String fileName = file.getOriginalFilename();
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        logger.info("上传文件名为：" + fileName + "." + suffixName);

        String filePath = path;
        fileName = UUID.randomUUID() + suffixName;
        File dest = new File(filePath + fileName);
        logger.info("准备存储文件到：" + dest);

        // 检测是否存在目录
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }

        try {
            Files.copy(file.getInputStream(), dest.toPath());
            logger.info("存储成功！");
            return fileName;
        } catch (IllegalStateException | IOException e) {
            throw new LogicException("500", "文件上传失败，原因是" + e.getMessage());
        }

    }
}
