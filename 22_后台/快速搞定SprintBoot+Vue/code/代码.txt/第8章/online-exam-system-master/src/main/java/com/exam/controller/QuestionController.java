package com.exam.controller;


import com.exam.domain.Question;
import com.exam.handler.StpHandler;
import com.exam.service.QuestionService;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//题目管理
@RestController
@RequestMapping(value = "/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;


    /**
     * 教师上传科目
     */
    @GetMapping("/postSubject")
    public ResultBody postSubject(@RequestParam String subjectName) {
        return ResultBody.success(questionService.postSubject(subjectName));
    }

    /**
     * 教师上传知识点
     */
    @GetMapping("/postKnowledgePoint")
    public ResultBody postKnowledgePoint(@RequestParam String knowledgePointName, @RequestParam int subjectId) {
        return ResultBody.success(questionService.postKnowledgePoint(knowledgePointName, subjectId));
    }

    /**
     * 教师上传题目
     */
    @PostMapping("/postQuestion")
    public ResultBody postQuestion(@RequestBody Question question) {
        return ResultBody.success(questionService.postQuestion(false, question));
    }

    /**
     * 根据id获取题目
     */
    @GetMapping("/getById/{id}")
    public ResultBody getById(@PathVariable int id) {
        return ResultBody.success(questionService.getQuestionById(id));
    }

    /**
     * 获取全部题目
     */
    @GetMapping("/getAll")
    public ResultBody getQuestionList(@RequestParam int index, @RequestParam int pageSize) {
        return ResultBody.success(questionService.getQuestionList(index, pageSize));
    }

    /**
     * 获取教师题目（分页）
     */
    @GetMapping("/getByTeacher")
    public ResultBody getQuestionListByTeacher(@RequestParam int index, @RequestParam int pageSize) {
        return ResultBody.success(questionService.getQuestionListByTeacher(index, pageSize, StpHandler.getId()));
    }

    /**
     * 组卷部分获取题目
     */
    @GetMapping("/getByExamPaper")
    public ResultBody getByExamPaper(@RequestParam int subjectId, @RequestParam String type) {
        return ResultBody.success(questionService.getByExamPaper(subjectId, type, StpHandler.getId()));
    }

    /**
     * 获取全部科目列表
     */
    @GetMapping("/getSubjectList")
    public ResultBody getSubjectList() {
        return ResultBody.success(questionService.getSubjectList());
    }

    /**
     * 根据科目id获取知识点
     */
    @GetMapping("/getKnowledgePointListBySubjectId")
    public ResultBody getKnowledgePointListBySubject(@RequestParam int subjectId) {
        return ResultBody.success(questionService.getKnowledgePointListBySubject(subjectId));
    }

    /**
     * 获取按科目分类的知识点列表
     */
    @GetMapping("/getKnowledgePointList")
    public ResultBody getKnowledgePointList() {
        return ResultBody.success(questionService.getKnowledgePointList());
    }

}
