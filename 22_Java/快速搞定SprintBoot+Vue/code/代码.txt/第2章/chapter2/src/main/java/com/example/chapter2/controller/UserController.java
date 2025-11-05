package com.example.chapter2.controller;

import com.example.chapter2.dto.UserDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @PostMapping("/users")
    public ResponseEntity<String> createUser(@Valid @RequestBody UserDTO user) {

        // 处理用户创建逻辑
        return ResponseEntity.ok("用户创建成功");
    }
}
