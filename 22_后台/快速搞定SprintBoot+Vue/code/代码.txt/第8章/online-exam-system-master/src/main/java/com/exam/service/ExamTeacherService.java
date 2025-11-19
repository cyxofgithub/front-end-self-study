package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.DTO.ExamingDTO;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExamTeacherService {

    @Autowired
    private TeacherMapper teacherMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private AnswerSheetMapper answerSheetMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamQuestionMapper examQuestionMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private MarkService markService;

    /**
     * 获取教师的全部考试
     * @param teacherId 教师id
     * @return 教师的全部考试列表
     */
    public List<Exam> getExamListByTeacher(String teacherId) {

        Teacher teacher = teacherMapper.selectById(teacherId);
        if (teacher == null) {
            throw new LogicException("400", "未找到教师！");
        }
        List<Exam> examList = examMapper.selectList(Wrappers.<Exam>query().lambda()
                .inSql(Exam::getLessonId, "select id from lesson where teacher_id = " + teacherId)
                .orderByDesc(Exam::getStartTime));

        // 判断是否有考试开始
        examService.startExamsOnTime(examList);
        // 判断是否有考试结束
        examService.finishExamsOnTime(examList);

        return examList;
    }

    /**
     * 获取考试（包括学生列表）
     * @param examId 考试id
     * @return 考试（包括学生列表）
     */
    public Exam getExamWithStudent(int examId) {

        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试！");
        }

        List<Student> studentList = studentMapper.selectList(Wrappers.<Student>query().lambda()
                .select(Student::getId, Student::getName)
                .inSql(Student::getId, "select student_id from lesson_student where lesson_id = " + exam.getLessonId()));

        exam.setStudentList(studentList);

        return exam;
    }

    /**
     * 获取包括考生全部回答的答题卡
     * @param examId 考试id
     * @param studentId 学生id
     * @return 包括考生全部回答的答题卡
     */
    public List<ExamingDTO> getAnswerSheetWithAnswer(int examId, String studentId) {

        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (exam.getStatus().equals(ExamStatus.NOTSTARTED.getValue()) || exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "考试未进行或仍在进行中，无法批阅试卷！");
        }

        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到该学生的信息！");
        }

        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));
        if (answerSheet == null) {
            throw new LogicException("400", "找不到该生答题卡！");
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

                // 批阅特有部分
                questionDTO.setGetScore(answer.getPointGet());
                questionDTO.setAnswer(question.getAnswer());

                questionDTOList.add(questionDTO);
            });

            examingDTO.setQuestionList(questionDTOList);
            examingDTO.setCount(questionDTOList.size());

            examingDTOList.add(examingDTO);
        });

        return examingDTOList;
    }

    /**
     * 上传批阅信息
     * @param examId 考试id
     * @param studentId 学生id
     * @param examingDTOList 考试信息
     * @return 更新后的学生考试信息
     */
    public List<ExamingDTO> markExamInfo(int examId, String studentId, List<ExamingDTO> examingDTOList) {

        // 查找考试
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "未找到考试信息！");
        }
        if (exam.getStatus().equals(ExamStatus.NOTSTARTED.getValue()) || exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
            throw new LogicException("400", "考试未进行或仍在进行中，无法批阅试卷！");
        }

        // 查找学生
        Student student = studentMapper.selectById(studentId);
        if (student == null) {
            throw new LogicException("400", "找不到该学生的信息！");
        }

        // 查找答题卡
        AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                .eq(AnswerSheet::getExamId, examId)
                .eq(AnswerSheet::getStudentId, studentId));
        if (answerSheet == null) {
            throw new LogicException("400", "找不到该生答题卡！");
        }
        if (answerSheet.getStatus().equals(AnswerSheetStatus.UNANSWERED.getValue()) || answerSheet.getStatus().equals(AnswerSheetStatus.ANSWERING.getValue())) {
            throw new LogicException("400", "当前答题卡状态为：" + answerSheet.getStatus() + "，无法批阅");
        }

        examingDTOList.forEach(examingDTO -> {
            examingDTO.getQuestionList().forEach(questionDTO -> {
                Answer answer = answerMapper.selectOne(Wrappers.<Answer>query().lambda()
                        .eq(Answer::getQuestionId, questionDTO.getNo())
                        .eq(Answer::getAnswerSheetId, answerSheet.getId()));
                answer.setPointGet(questionDTO.getGetScore());
                answerMapper.updateById(answer);
            });
        });

        // 处理答题卡分数
         markService.publishGrade(answerSheet.getId());

         // 遍历该考试所有答题卡是否批阅完成，若都完成改变考试状态
        markService.publishExam(examId);

        return getAnswerSheetWithAnswer(examId, studentId);
    }

}
