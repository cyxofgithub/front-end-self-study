package com.example.film_review.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<String> handleFileStorageException
            (FileStorageException ex) {
        // 直接返回异常消息和内部服务器错误状态
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body
                ("文件存储错误: " + ex.getMessage());
    }
    // 可以添加更多的异常处理 ...
}
