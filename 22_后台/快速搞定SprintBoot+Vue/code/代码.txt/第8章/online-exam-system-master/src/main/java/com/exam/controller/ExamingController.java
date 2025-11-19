package com.exam.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.exam.domain.DTO.ExamingDTO;
import com.exam.handler.StpHandler;
import com.exam.service.ExamService;
import com.exam.service.ExamStudentService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
//考试过程管理
@RestController
@RequestMapping(value = "/examing")
public class ExamingController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamStudentService examStudentService;

    @GetMapping("/startExam/{examId}")
    public ResultBody startExam(@PathVariable int examId) {
        return ResultBody.success(examService.startExam(examId));
    }

    @GetMapping("/finishExam/{examId}")
    public ResultBody endExam(@PathVariable int examId) {
        return ResultBody.success(examService.finishExam(examId));
    }


    @GetMapping("/finishAnswerSheet")
    public ResultBody finishAnswerSheet(@RequestParam int examId) {
        return ResultBody.success(examStudentService.finishAnswerSheet(examId, StpHandler.getId()));
    }

    @GetMapping("/getExamInfo")
    public ResultBody getExamInfo(@RequestParam int examId) {
        return ResultBody.success(examStudentService.getExamInfo(examId, StpHandler.getId()));
    }


    @PostMapping("/postExamInfo")
    public ResultBody postExamInfo(@RequestParam int examId, @RequestBody List<ExamingDTO> examingDTOList) {
        return ResultBody.success(examStudentService.postExamInfo(examId, StpHandler.getId(), examingDTOList));
    }


    @GetMapping("/getExamAccess")
    public ResultBody getExamAccess(@RequestParam int examId) {
        return ResultBody.success(examStudentService.getExamAccess(examId, StpHandler.getId()));
    }

}
