package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.enums.ExamStatus;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Transactional
@Service
public class ExamPaperService {

    @Autowired
    private QuestionService questionService;
    @Autowired
    private MessageService messageService;
    @Autowired
    private LessonMapper lessonMapper;
    @Autowired
    private ExamMapper examMapper;
    @Autowired
    private ExamQuestionMapper examQuestionMapper;

     //手动组卷
    public Exam addPaperManual(Exam exam, List<Question[]> questionList, List<Boolean[]> isCopyList, List<Double[]> scoreList, List<String> bigTypeList) {

        Exam e = this.addExam(exam);
        this.addManualQuestionList(e.getId(), questionList, isCopyList, scoreList, bigTypeList);
        // 发送通知
        messageService.sendExamMessage(exam);
        return e;
    }

     //添加考试信息
    public Exam addExam(Exam exam) {

        // 依次处理信息
        Lesson lesson = lessonMapper.selectById(exam.getLessonId());
        if (lesson == null) {
            throw new LogicException("400", "未找到队对应班级！");
        }
        if (exam.getName().equals("")) {
            throw new LogicException("400", "请输入姓名！");
        }
        // 检查时间
        if (exam.getStartTime().compareTo(exam.getEndTime()) >= 0) {
            throw new LogicException("400", "结束时间必须晚于开始时间！");
        } else if (exam.getStartTime().compareTo(new Date()) < 0) {
            throw new LogicException("400", "无法添加已经开始的考试！");
        }
        exam.setCreateTime(new Date());
        exam.setStatus(ExamStatus.NOTSTARTED.getValue());
        exam.setSubjectId(lesson.getSubjectId());
        examMapper.insert(exam);
        return exam;
    }

    //添加题目、题目与考试关系
    public List<Question[]> addManualQuestionList(int examId, List<Question[]> questionList, List<Boolean[]> isCopyList, List<Double[]> scoreList, List<String> bigTypeList) {

        if (questionList.isEmpty()) {
            throw new LogicException("400", "试卷为空！");
        }
        // 大题
        for (int i = 0; i < questionList.size(); i++) {
            if (questionList.get(i).length == 0) {
                throw new LogicException("400", "大题" + i + "为空");
            }
            // 将小题加入题库
            for (int j = 0; j < questionList.get(i).length; j++) {
                Question question = questionService.postQuestion(isCopyList.get(i)[j], questionList.get(i)[j]);
                ExamQuestion examQuestion = new ExamQuestion(null, examId, question.getId(), scoreList.get(i)[j], isCopyList.get(i)[j], i, j, bigTypeList.get(i), null, null);
                examQuestionMapper.insert(examQuestion);
            }
        }
        return questionList;
    }

}
