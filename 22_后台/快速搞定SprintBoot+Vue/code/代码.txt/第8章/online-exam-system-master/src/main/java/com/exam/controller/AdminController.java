package com.exam.controller;


import com.exam.service.AdminService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


// 管理员
@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    @Autowired
    AdminService adminService;

    @PostMapping("/login")
    public ResultBody login(@RequestParam("id") String id,@RequestParam("password") String password) {
        return ResultBody.success(adminService.login(id,password));
    }

    @PostMapping("/studentCertify")
    public ResultBody studentCertify(@RequestParam String id, @RequestParam boolean certified) {
        return ResultBody.success(adminService.studentCertify(id, certified));
    }

    @PostMapping("/teacherCertify")
    public ResultBody teacherCertify(@RequestParam String id, @RequestParam boolean certified) {
        return ResultBody.success(adminService.teacherCertify(id, certified));
    }

    @GetMapping("/getQuestion")
    public ResultBody getQuestion() {
        return ResultBody.success(adminService.getQuestion());
    }

    @GetMapping("/getQuestionList")
    public ResultBody getQuestionList() {
        return ResultBody.success(adminService.getQuestionList());
    }


    /**
     * 获取全部学生名单
     */
    @GetMapping("/getAllStudent")
    public ResultBody getAllStudent(int index, int pageSize) {
        return ResultBody.success(adminService.getAllStudent(index, pageSize));
    }

    /**
     * 获取全部教师名单（分页）
     */
    @GetMapping("/getAllTeacher")
    public ResultBody getAllTeacher(int index, int pageSize) {
        return ResultBody.success(adminService.getAllTeacher(index, pageSize));
    }

    /**
     * 根据审核状态获取学生名单
     */
    @GetMapping("/getAllStudentByCertified")
    public ResultBody getAllStudent(int index, int pageSize, String certified) {
        return ResultBody.success(adminService.getStudentByCertified(index, pageSize, certified));
    }

    /**
     * 根据审核状态获取教师名单（分页）
     */
    @GetMapping("/getAllTeacherByCertified")
    public ResultBody getAllTeacher(int index, int pageSize, String certified) {
        return ResultBody.success(adminService.getTeacherByCertified(index, pageSize, certified));
    }
}
