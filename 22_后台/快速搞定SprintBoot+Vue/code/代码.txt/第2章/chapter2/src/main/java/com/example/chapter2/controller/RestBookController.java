package com.example.chapter2.controller;

import com.example.chapter2.model.ApiResponse;
import com.example.chapter2.model.Book;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class RestBookController {


    // 获取所有图书
    @GetMapping
    public ApiResponse<List<Book>> getAllBooks() {
        return null;
    }

    // 根据ID获取图书
    @GetMapping("/{id}")
    public ApiResponse<Book> getBookById(@PathVariable Long id) {
        return null;
    }

    // 添加新图书
    @PostMapping
    public ApiResponse<Book> createBook(@RequestBody Book book) {
        return null;
    }

    // 更新图书信息
    @PutMapping("/{id}")
    public ApiResponse<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        return null;
    }

    // 删除图书
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBook(@PathVariable Long id) {
        return null;
    }
}

