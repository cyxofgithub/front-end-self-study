package com.exam.controller;

import com.exam.domain.DTO.ExamPaperDTO;
import com.exam.domain.DTO.ExamPaperResponseDTO;
import com.exam.service.ExamPaperService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//组卷/发布考试
@RestController
@RequestMapping(value = "/examPaper")
public class ExamPaperController {

    @Autowired
    private ExamPaperService examPaperService;

//   组卷
    @PostMapping("/addPaperManual")
    public ResultBody addPaperManual(@RequestBody ExamPaperDTO examPaperDTO) {

        ExamPaperResponseDTO examPaperResponseDTO = examPaperDTO.handleInfo();
        return ResultBody.success(examPaperService.addPaperManual(examPaperDTO.getExam(),
                examPaperResponseDTO.getQuestionList(),
                examPaperResponseDTO.getIsCopyList(),
                examPaperResponseDTO.getScoreList(),
                examPaperResponseDTO.getBigTypeList()));
    }
}
