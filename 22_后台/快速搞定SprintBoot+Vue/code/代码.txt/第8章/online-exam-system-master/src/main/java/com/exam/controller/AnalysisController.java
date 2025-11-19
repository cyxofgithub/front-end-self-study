package com.exam.controller;


import com.exam.handler.StpHandler;
import com.exam.service.AnalysisService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


// 成绩分析
@RestController
@RequestMapping(value = "/analysis")
public class AnalysisController{

    @Autowired
    private AnalysisService analysisService;

    //  获取学生考试的分数分布
    @GetMapping("/getStudentGradeByNum")
    public ResultBody getStudentGradeByNum(){
        return ResultBody.success(analysisService.getStudentGradeByNum(StpHandler.getId()));
    }

    //  获取学生考试这门课的考试分数变化
    @GetMapping("/getGradeTrend")
    public ResultBody getGradeTrend(@RequestParam("lessonId") Integer lessonId){
        return ResultBody.success(analysisService.getGradeTrend(StpHandler.getId(), lessonId));
    }

    //  获取单次考试的分数分布
    @GetMapping("/getAllGradeByExamId/{examId}")
    public ResultBody getAllGradeByExamId(@PathVariable Integer examId){
        return ResultBody.success(analysisService.getAllGradeByExamId(examId));
    }

//    获取班级所有考试的分数分布
    @GetMapping("/getAllGradeByLessonId/{lessonId}")
    public ResultBody getAllGradeByLessonId(@PathVariable Integer lessonId){
        return ResultBody.success(analysisService.getAllGradeByLessonId(lessonId));
    }
//  获取学生在班级所有考试的知识点得分情况
    @GetMapping("/getRadarByStudentIdAndLessonId/{lessonId}")
    public ResultBody getRadarByStudentIdAndLessonId(@PathVariable Integer lessonId){
        return ResultBody.success(analysisService.getAllKnowledgeGradeByLessonId(lessonId,StpHandler.getId()));
    }

}
