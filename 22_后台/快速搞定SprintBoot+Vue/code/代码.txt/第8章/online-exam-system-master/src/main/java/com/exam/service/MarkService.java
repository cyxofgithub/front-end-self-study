package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import com.exam.domain.enums.QuestionType;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Transactional
public class MarkService {

    @Autowired
    private MessageService messageService;

    @Autowired
    private AnswerSheetMapper answerSheetMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private ExamQuestionMapper examQuestionMapper;

    @Autowired
    private ExamMapper examMapper;

    /**
     * 自动批阅某答题卡的全部回答并计算客观题总分
     * @param answerSheetId 答题卡id
     * @return 答题卡
     */
    public AnswerSheet markObjectiveByAnswerSheet(int answerSheetId) {

        AnswerSheet answerSheet = answerSheetMapper.selectById(answerSheetId);
        if (answerSheet == null) {
            throw new LogicException("400", "未找到对应答题卡！");
        }

        List<Answer> answerList = answerMapper.selectList(Wrappers.<Answer>query().lambda()
                .eq(Answer::getAnswerSheetId, answerSheetId)
                .inSql(Answer::getQuestionId, "select question_id from exam_question where exam_id = " + answerSheet.getExamId()
                        + " and (big_type = '" + QuestionType.SINGLE.getValue()
                        + "' or big_type = '" + QuestionType.MULTIPLE.getValue()
                        + "' or big_type = '" + QuestionType.FILLING.getValue()
                        + "' or big_type = '" + QuestionType.CHECK.getValue() + "')")
        );

        double objectiveTotal = answerList
                .stream()
                .map(answer -> this.markObjectiveById(answerSheet.getExamId(), answer.getId()))
                .mapToDouble(Answer::getPointGet)
                .sum();

        answerSheet.setObjectivePoint(objectiveTotal);
        answerSheet.setTotalPoint(objectiveTotal + answerSheet.getSubjectivePoint());

        answerSheetMapper.updateById(answerSheet);

        return answerSheet;
    }

    /**
     * 根据id自动批阅客观题
     * @param examId 考试id
     * @param answerId 回答id
     * @return 批阅后的answer
     */
    public Answer markObjectiveById(int examId, int answerId) {

        Answer answer = answerMapper.selectById(answerId);
        if (answer == null) {
            throw new LogicException("400", "未找到回答！");
        }

        Question question = questionMapper.selectById(answer.getQuestionId());
        if (question == null) {
            throw new LogicException("400", "未找到题目");
        }

        if (question.getType().equals(QuestionType.SINGLE.getValue()) || question.getType().equals(QuestionType.CHECK.getValue())) {
            // 单选题和判断题批阅
            if (answer.getContent().equals(question.getAnswer())) {
                double point = examQuestionMapper.selectOne(Wrappers.<ExamQuestion>query().lambda()
                        .eq(ExamQuestion::getExamId, examId)
                        .eq(ExamQuestion::getQuestionId, question.getId())).getScore();
                answer.setPointGet(point);
            } else {
                answer.setPointGet(0.0);
            }
        } else if (question.getType().equals(QuestionType.FILLING.getValue())) {
            // 填空题批阅
            double point = examQuestionMapper.selectOne(Wrappers.<ExamQuestion>query().lambda()
                    .eq(ExamQuestion::getExamId, examId)
                    .eq(ExamQuestion::getQuestionId, question.getId())).getScore();

            String temp = answer.getContent().replaceAll(",,", ", ,");

            String[] answerTemp = temp.split(",");
            String[] questionTemp = question.getAnswer().split(",");

            int pointGet = 0;

            if (answerTemp.length == questionTemp.length) {
                for (int i = 0; i < answerTemp.length; i++) {
                    if (answerTemp[i].equals(questionTemp[i])) {
                        pointGet ++;
                    }
                }
                answer.setPointGet((1.0 * pointGet / answerTemp.length) * point);
            } else {
                answer.setPointGet(0.0);
            }
        } else if (question.getType().equals(QuestionType.MULTIPLE.getValue())) {
            // 多选题批阅
            double point = examQuestionMapper.selectOne(Wrappers.<ExamQuestion>query().lambda()
                    .eq(ExamQuestion::getExamId, examId)
                    .eq(ExamQuestion::getQuestionId, question.getId())).getScore();

            String[] answerTemp = answer.getContent().split(",");
            String[] questionTemp = question.getAnswer().split(",");

            if (answerTemp.length > questionTemp.length) {
                answer.setPointGet(0.0);
            } else if (answerTemp.length == questionTemp.length) {
                for (String s : answerTemp) {
                    if (!question.getAnswer().contains(s)) {
                        answer.setPointGet(0.0);
                        break;
                    } else {
                        answer.setPointGet(point);
                    }
                }
            } else {
                if(answerTemp[0].equals("")){
                    answer.setPointGet(0.0);
                } else {
                    for (String s : answerTemp) {
                        if (!question.getAnswer().contains(s)) {
                            answer.setPointGet(0.0);
                            break;
                        } else {
                            answer.setPointGet(point / 2);
                        }
                    }
                }
            }
        }

        answerMapper.updateById(answer);

        return answer;
    }

    /**
     * 根据批阅状态发布该考试全部答题卡的成绩
     * @param examId 考试id
     * @return 考试信息
     */
    public Exam publishExam(int examId) {

        // 更新考试状态
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "找不到考试！");
        }

        // 更新答题卡状态
        List<AnswerSheet> answerSheetList = answerSheetMapper.selectList(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId));

        for (AnswerSheet answerSheet : answerSheetList) {
            if (!answerSheet.getStatus().equals(AnswerSheetStatus.MARKED.getValue())) {
                return exam;
            }
        }

        exam.setStatus(ExamStatus.MARKED.getValue());
        examMapper.updateById(exam);

        for (AnswerSheet answerSheet : answerSheetList) {
            messageService.sendScoreMessage(answerSheet);
        }

        return exam;
    }

    /**
     * 发布某张答题卡的成绩
     * @param answerSheetId 答题卡id
     * @return 答题卡信息
     */
    public AnswerSheet publishGrade(int answerSheetId) {

        AnswerSheet answerSheet = answerSheetMapper.selectById(answerSheetId);
        if (answerSheet == null) {
            throw new LogicException("400", "未找到对应答题卡！");
        }

        // 核算客观题得分
        List<Answer> answerList = answerMapper.selectList(Wrappers.<Answer>query().lambda()
                .eq(Answer::getAnswerSheetId, answerSheetId)
                .inSql(Answer::getQuestionId, "select question_id from exam_question where exam_id = " + answerSheet.getExamId()
                        + " and (big_type = '" + QuestionType.SINGLE.getValue()
                        + "' or big_type = '" + QuestionType.MULTIPLE.getValue()
                        + "' or big_type = '" + QuestionType.FILLING.getValue()
                        + "' or big_type = '" + QuestionType.CHECK.getValue() + "')")
        );

        double objectiveTotal = answerList
                .stream()
                .mapToDouble(Answer::getPointGet)
                .sum();

        // 核算主观题得分
        answerList = answerMapper.selectList(Wrappers.<Answer>query().lambda()
                .eq(Answer::getAnswerSheetId, answerSheetId)
                .inSql(Answer::getQuestionId, "select question_id from exam_question where exam_id = " + answerSheet.getExamId()
                        + " and big_type = '" + QuestionType.SHORTANSWER.getValue() + "'"));

        double subjectiveTotal = answerList
                .stream()
                .mapToDouble(Answer::getPointGet)
                .sum();

        answerSheet.setStatus(AnswerSheetStatus.MARKED.getValue());
        answerSheet.setSubjectivePoint(subjectiveTotal);
        answerSheet.setObjectivePoint(objectiveTotal);
        answerSheet.setTotalPoint(objectiveTotal + subjectiveTotal);

        answerSheetMapper.updateById(answerSheet);

        return answerSheet;
    }

}
