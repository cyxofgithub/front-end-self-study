package com.exam.controller;

import com.exam.domain.Student;
import com.exam.handler.StpHandler;
import com.exam.service.StudentService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


//学生账号操作
@RestController
@RequestMapping(value = "/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/register")
    public ResultBody register(@RequestParam(required = false) String id, @RequestBody Student student){
        return ResultBody.success(studentService.register(id, student));
    }
    @PostMapping("/login")
    public ResultBody login(@RequestParam("id") String id, @RequestParam("password") String password){
        return ResultBody.success(studentService.login(id, password));
    }

    @GetMapping("/getStudentInfo")
    public ResultBody getStudentInfo(){
        return ResultBody.success(studentService.getStudentInfo(StpHandler.getId()));
    }
}
