package com.exam.controller;

import com.exam.handler.StpHandler;
import com.exam.service.LessonService;
import com.exam.service.StudentService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//班级管理
@RestController
@RequestMapping(value = "/lesson")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private StudentService studentService;

//    学生加入班级
    @PostMapping("/join")
    public ResultBody join(@RequestParam("uuid") String uuid) {
        return ResultBody.success(lessonService.join(StpHandler.getId(), uuid));
    }

//    添加课程
    @PostMapping("/addLesson")
    public ResultBody addLesson(@RequestParam("name") String name, @RequestParam("subjectId") int subjectId) {
        return ResultBody.success(lessonService.addLesson(name, subjectId, StpHandler.getId()));
    }

//    查找该教师的所有课程
    @GetMapping("/getLessonByTeacherId")
    public ResultBody getLessonByTeacherId() {
        return ResultBody.success(lessonService.getLessonListByTeacherId(StpHandler.getId()));
    }

//    按id查找课程
    @GetMapping("/getLessonById/{lessonId}")
    public ResultBody getLessonById(@PathVariable Integer lessonId) {
        return ResultBody.success(lessonService.getLessonById(lessonId));
    }

//    按课程id查找学生
    @GetMapping("/getStudentByLessonId/{lessonId}")
    public ResultBody getStudentByLessonId(@PathVariable Integer lessonId) {
        return ResultBody.success(lessonService.getStudentByLessonId(lessonId));
    }

//    将学生踢出班级
    @PostMapping("/deleteStudentInLesson")
    public ResultBody deleteStudentInLesson(@RequestParam("lessonId") Integer lessonId,@RequestParam("studentId") String studentId) {
        return ResultBody.success(lessonService.deleteStudentInLesson(lessonId, studentId));
    }

//    获得学生的班级列表
    @GetMapping("/getLessonListByStudentId")
    public ResultBody getLessonListByStudentId() {
        return ResultBody.success(lessonService.getLessonListByStudentId(StpHandler.getId()));
    }

//    获得学生信息
    @GetMapping("/getStudentInfoById")
    public ResultBody getStudentInfoById(@RequestParam String studentId) {
        return ResultBody.success(studentService.getStudentInfo(studentId));
    }
}
