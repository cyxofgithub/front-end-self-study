package com.exam.controller;

import com.exam.domain.Teacher;
import com.exam.service.TeacherService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//教师账号操作
@RestController
@RequestMapping(value = "/teacher")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;
//    教师注册
    @PostMapping("/register")
    public ResultBody register(@RequestParam(required = false) String id, @RequestBody Teacher teacher){
        return ResultBody.success(teacherService.register(id, teacher));
    }
//  教师登录
    @PostMapping("/login")
    public ResultBody login(@RequestParam("id") String id, @RequestParam("password") String password){
        return ResultBody.success(teacherService.login(id,password));
    }
}
