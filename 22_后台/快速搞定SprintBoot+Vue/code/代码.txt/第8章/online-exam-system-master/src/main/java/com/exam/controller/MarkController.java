package com.exam.controller;

import com.exam.domain.DTO.ExamingDTO;
import com.exam.service.ExamTeacherService;
import com.exam.service.MarkService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


//批阅管理
@RestController
@RequestMapping(value = "/mark")
public class MarkController {

    @Autowired
    private ExamTeacherService examTeacherService;

    @Autowired
    private MarkService markService;

//    获取某学生答题卡批阅信息
    @GetMapping("/getAnswerSheet")
    public ResultBody getAnswerSheetWithAnswer(@RequestParam int examId, @RequestParam String studentId) {
        return ResultBody.success(examTeacherService.getAnswerSheetWithAnswer(examId, studentId));
    }

//    上传批阅的信息
    @PostMapping("/postAnswerSheet")
    public ResultBody postAnswerSheetWithAnswer(@RequestParam int examId, @RequestParam String studentId, @RequestBody List<ExamingDTO> examingDTOList) {
        return ResultBody.success(examTeacherService.markExamInfo(examId, studentId, examingDTOList));
    }

}
