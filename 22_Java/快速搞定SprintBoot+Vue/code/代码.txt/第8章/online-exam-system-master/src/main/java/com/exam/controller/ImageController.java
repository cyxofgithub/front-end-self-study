package com.exam.controller;

import com.exam.handler.ImageHandler;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


//图片管理
@RestController
@RequestMapping(value = "/images")
public class ImageController {

    @Autowired
    private ImageHandler imageHandler;

//    上传图片
    @PostMapping("/upload")
    public ResultBody create(MultipartFile file) {
        return ResultBody.success(imageHandler.upLoad(file));
    }
}
