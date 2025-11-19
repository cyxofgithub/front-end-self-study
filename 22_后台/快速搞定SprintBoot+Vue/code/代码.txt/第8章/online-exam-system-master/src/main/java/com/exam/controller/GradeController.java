package com.exam.controller;

import com.exam.handler.StpHandler;
import com.exam.service.ExamService;
import com.exam.service.GradeService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//成绩管理
@RestController
@RequestMapping(value = "/grade")
public class GradeController {

    @Autowired
    private ExamService examService;

    @Autowired
    private GradeService gradeService;

//    根据学生id获取学生所有考试的成绩
    @GetMapping("/getGradeByStudent")
    public ResultBody getGradeByStudent() {
        return ResultBody.success(gradeService.getGradeByStudent(StpHandler.getId()));

    }

//    根据考试id获取所有学生成绩
    @GetMapping("/getGradeByExam/{examId}")
    public ResultBody getGradeByExam(@PathVariable int examId) {
        return ResultBody.success(gradeService.getGradeByExam(examId));
    }

}
