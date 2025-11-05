package com.example.chapter2.controller;

import com.example.chapter2.model.ApiResponse;
import com.example.chapter2.model.Book;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookController {

    // 处理到 "/api/data"请求
    @RequestMapping("/books")
    public List<String> getAllBooks() {
        return Arrays.asList("The Great Gatsby", "Moby Dick", "War and Peace");
    }

    @RequestMapping("/books/{bookId}")
    public String getBook(@PathVariable String bookId) {
        // 获取路径中传递的bookId
        System.out.println(bookId);
        // 获取和返回具有指定bookId的书籍
        return "The Great Gatsby";
    }

    @GetMapping("/search")
    public String search(String query,String page) {
        // 此处的query和page参数将自动赋值为URL中的相应查询参数的值。
        // ...
        System.out.println(query);
        System.out.println(page);
        return "";
    }

    @PostMapping("/")
    public String createBook(@RequestBody Book book) {
        // 保存书籍或进行其他处理...
        System.out.println(book);
        return "创建成功";
    }

    @GetMapping("/{id}")
    public ApiResponse<Book> getBookById(@PathVariable Long id) {
        // 假设我们查找书籍，这里只是模拟
        Book book = findBookById(id);
        if (book != null) {
            return ApiResponse.success(book);
        } else {
            return ApiResponse.error("Book not found");
        }
    }

    private Book findBookById(Long id) {
        return null;
    }

}

