package com.example.chapter2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;

@Controller
public class WebController {

    @GetMapping("/page")
    public String getPage() {
        // 返回index视图（例如: index.jsp 或 index.html）
        return "index";
    }

    @GetMapping("/data")
    @ResponseBody
    public List<String> getData() {
        // 直接返回书籍列表
        return Arrays.asList("The Great Gatsby", "Moby Dick", "War and Peace");
    }
}
