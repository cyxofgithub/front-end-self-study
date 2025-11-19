package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.DTO.ExamingDTO;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import com.exam.domain.enums.QuestionType;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ExamStudentService {

    @Autowired
    private ExamQuestionMapper examQuestionMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private AnswerSheetMapper answerSheetMapper;

    @Autowired
    @Lazy
    private ExamService examService;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private MarkService markService;

     // 按学生id获取考试列表
    public List<Exam> getExamListByStudent(String studentId) {

        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "未找到学生！");
        }
        List<Exam> examList = examMapper.selectList(Wrappers.<Exam>query().lambda()
                .inSql(Exam::getLessonId, "select lesson_id from lesson_student where student_id = " + studentId)
                .orderByDesc(Exam::getStartTime));
        System.out.println(examList);
        examList.forEach(exam -> {
            Lesson lesson = lessonMapper.selectById(exam.getLessonId());
            exam.setLesson(lesson);
            // 判断考试是否开始
            if (exam.getStartTime().compareTo(new Date()) <= 0 && exam.getEndTime().compareTo(new Date()) >= 0 && exam.getStatus().equals(ExamStatus.NOTSTARTED.getValue())) {
                examService.startExam(exam.getId());
            }
            // 判断考试是否结束
            if (exam.getEndTime().compareTo(new Date()) <= 0 && (exam.getStatus().equals(ExamStatus.STARTED.getValue()) || exam.getStatus().equals(ExamStatus.NOTSTARTED.getValue()))) {
                examService.finishExam(exam.getId());
            }
        });
        return examList;
    }

     //学生点击开始考试，发放该生答题卡
    public AnswerSheet addAnswerSheet(String studentId, int examId) {

        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "未找到学生！");
        }
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试！");
        }
        if (!exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "当前考试状态是：" + exam.getStatus());
        }
        if (answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId,studentId)) != null) {
            throw new LogicException("400", "该学生答题卡已存在！");
        }
        AnswerSheet answerSheet = new AnswerSheet(null, 0.0, 0.0, 0.0, new Date(), new Date(), AnswerSheetStatus.UNANSWERED.getValue(), examId, studentId, null, null, null);
        answerSheetMapper.insert(answerSheet);
        // 初始化答题卡回答
        return this.addAnswer(answerSheet, examId);
    }

     //发放答题卡的同时初始化答题卡回答
    public AnswerSheet addAnswer(AnswerSheet answerSheet, int examId) {
        List<Question> questionList = questionMapper.selectList(Wrappers.<Question>query().lambda()
                .inSql(Question::getId, "select question_id from exam_question where exam_id = " + examId));
        questionList.forEach(question -> {
            // 特殊处理填空题
            Answer answer = new Answer(null, "", 0.0, new Date(), question.getId(), answerSheet.getId(), null, null);
            if (question.getType().equals(QuestionType.FILLING.getValue())) {
                String[] temp = question.getAnswer().split(",");
                StringBuilder stringBuilder = new StringBuilder();
                for (int i = 1; i < temp.length; i++) {
                    stringBuilder.append(",");
                }
                answer.setContent(stringBuilder.toString());
            }
            answerMapper.insert(answer);
        });
        return answerSheet;
    }

     //查找某考试的全部题目
    public List<Question> getQuestionListByExam(int examId) {
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试！");
        }
        List<Question> questionList = questionMapper.selectList(Wrappers.<Question>query().lambda()
                .inSql(Question::getId, "select question_id from exam_question where exam_id = " + examId)
                .orderByDesc(Question::getCreateTime));

        return questionList;
    }

    //根据答题卡id查找回答
    public List<Answer> getAnswerListByAnswerSheet(int answerSheetId) {
        AnswerSheet answerSheet = answerSheetMapper.selectById(answerSheetId);
        if (answerSheet == null) {
            throw new LogicException("400", "未找到答题卡！");
        }
        return answerMapper.selectList(Wrappers.<Answer>query().lambda()
                .eq(Answer::getAnswerSheetId, answerSheetId));
    }

     //提交答题卡
    public AnswerSheet finishAnswerSheet(int examId, String studentId) {
        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (!exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "未在考试时间内，无法提交答案！");
        }
        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到您的信息！");
        }
        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));

        if (answerSheet == null) {
            throw new LogicException("400", "未找到答题卡，请刷新重试");
        }
        answerSheet.setStatus(AnswerSheetStatus.UNMARKED.getValue());
        answerSheetMapper.updateById(answerSheet);
        markService.markObjectiveByAnswerSheet(answerSheet.getId());
        return answerSheet;
    }

     //获取考试信息
    public List<ExamingDTO> getExamInfo(int examId, String studentId) {
        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (!exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "未在考试时间内，无法查看考试信息！");
        }
        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到您的信息！");
        }
        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));
        if (answerSheet == null) {
            throw new LogicException("400", "找不到答题卡，请查看考试是否已开始！");
        }
        if (answerSheet.getStatus().equals(AnswerSheetStatus.UNANSWERED.getValue())) {
            answerSheet.setStatus(AnswerSheetStatus.ANSWERING.getValue());
            answerSheetMapper.updateById(answerSheet);
        }
        // 依次处理题目信息
        List<ExamingDTO> examingDTOList = new ArrayList<>();

        List<ExamQuestion> bigTypes = examQuestionMapper.selectList(Wrappers.<ExamQuestion>query().lambda()
                .select(ExamQuestion::getBigType)
                .eq(ExamQuestion::getExamId, examId)
                .groupBy(ExamQuestion::getBigType));
        // 大题循环
        bigTypes.forEach(bigTYpe -> {
            ExamingDTO examingDTO = new ExamingDTO();
            examingDTO.setTypeName(bigTYpe.getBigType());
            List<ExamingDTO.QuestionDTO> questionDTOList = new ArrayList<>();
            // 小题循环
            List<ExamQuestion> examQuestionList = examQuestionMapper.selectList(Wrappers.<ExamQuestion>query().lambda()
                    .eq(ExamQuestion::getExamId, examId)
                    .eq(ExamQuestion::getBigType, bigTYpe.getBigType()));
            // 为每道小题赋值
            examQuestionList.forEach(examQuestion -> {
                ExamingDTO.QuestionDTO questionDTO = new ExamingDTO.QuestionDTO();
                questionDTO.setNo(examQuestion.getQuestionId());
                questionDTO.setNumber(examQuestion.getBigQid());
                questionDTO.setTotalScore(examQuestion.getScore());
                questionDTO.setType(examQuestion.getBigType());

                Question question = questionMapper.selectById(examQuestion.getQuestionId());
                questionDTO.setStem(question.getStem());

                Answer answer = answerMapper.selectOne(Wrappers.<Answer>query().lambda()
                        .eq(Answer::getQuestionId, question.getId())
                        .eq(Answer::getAnswerSheetId, answerSheet.getId()));
                questionDTO.setExamineAnswer(answer.getContent());

                questionDTOList.add(questionDTO);
            });
            examingDTO.setQuestionList(questionDTOList);
            examingDTO.setCount(questionDTOList.size());
            examingDTOList.add(examingDTO);
        });
        return examingDTOList;

    }

    //上传答案（不提交答题卡）
    public List<ExamingDTO> postExamInfo(int examId, String studentId, List<ExamingDTO> examingDTOList) {
        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (!exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "未在考试时间内，无法提交答案！");
        }
        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到您的信息！");
        }
        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));
        if (answerSheet == null) {
            throw new LogicException("400", "找不到答题卡，请查看考试是否已开始！");
        }
        if (!answerSheet.getStatus().equals(AnswerSheetStatus.ANSWERING.getValue())) {
            throw new LogicException("400", "当前答题卡状态为：" + answerSheet.getStatus() + "，无法继续答题");
        }
        examingDTOList.forEach(examingDTO -> {
            examingDTO.getQuestionList().forEach(questionDTO -> {
                Answer answer = answerMapper.selectOne(Wrappers.<Answer>query().lambda()
                        .eq(Answer::getQuestionId, questionDTO.getNo())
                        .eq(Answer::getAnswerSheetId, answerSheet.getId()));
                answer.setContent(questionDTO.getExamineAnswer());
                answerMapper.updateById(answer);
            });
        });
        return getExamInfo(examId, studentId);
    }

     //获取是否可以参加考试
    public AnswerSheet getExamAccess(int examId, String studentId) {
        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (!exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "未在考试时间内，无法进入考试！");
        }
        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到您的信息！");
        }
        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));
        if (answerSheet == null) {
            throw new LogicException("400", "找不到答题卡，请查看考试是否已开始或刷新重试！");
        }
        if (answerSheet.getStatus().equals(AnswerSheetStatus.UNMARKED.getValue())
                || answerSheet.getStatus().equals(AnswerSheetStatus.MARKED.getValue())
                || answerSheet.getStatus().equals(AnswerSheetStatus.CANCELLED.getValue())) {
            throw new LogicException("400", "当前答题卡状态为：" + answerSheet.getStatus() + "，无法继续答题");
        }
        return answerSheet;
    }
}
