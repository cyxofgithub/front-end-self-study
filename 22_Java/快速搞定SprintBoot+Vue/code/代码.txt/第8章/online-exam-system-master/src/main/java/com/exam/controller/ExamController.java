package com.exam.controller;

import com.exam.handler.StpHandler;
import com.exam.service.ExamService;
import com.exam.service.ExamStudentService;
import com.exam.service.ExamTeacherService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//考试管理
@RestController
@RequestMapping(value = "/exam")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamStudentService examStudentService;

    @Autowired
    private ExamTeacherService examTeacherService;

    /**
     * 获取某班级的考试列表
     */
    @GetMapping("/getByLesson/{lessonId}")
    public ResultBody getExamListByLessonId(@PathVariable int lessonId) {
        return ResultBody.success(examService.getExamListByLesson(lessonId));
    }

    /**
     * 获取某学生的考试列表
     */
    @GetMapping("/getByStudent")
    public ResultBody getExamListByStudentId() {
        System.out.println(StpHandler.getId());
        return ResultBody.success(examStudentService.getExamListByStudent(StpHandler.getId()));
    }

    /**
     * 根据id获取考试 包括科目和班级信息
     */
    @GetMapping("/getById/{id}")
    public ResultBody getById(@PathVariable int id) {
        return ResultBody.success(examService.getExamById(id));
    }

    /**
     * 根据id获取考试(包含学生信息list)
     */
    @GetMapping("/getWithStudentById/{id}")
    public ResultBody getByWithStudentId(@PathVariable int id) {
        return ResultBody.success(examTeacherService.getExamWithStudent(id));
    }

}
