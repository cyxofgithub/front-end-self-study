package com.exam.controller;


import com.exam.handler.StpHandler;
import com.exam.service.MessageService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//消息管理
@RestController
@RequestMapping(value = "/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

//    获得学生的消息列表
    @GetMapping("/getMessageList")
    public ResultBody getMessageList(){
        return ResultBody.success(messageService.getMessageList(StpHandler.getId()));
    }
}
