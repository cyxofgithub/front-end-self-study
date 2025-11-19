package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ExamService {

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private AnswerSheetMapper answerSheetMapper;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private ExamStudentService examStudentService;

    @Autowired
    private MarkService markService;

    /**
     * 根据id获取考试
     * @param id 考试id
     * @return 包括课程和科目的考试信息
     */
    public Exam getExamById(int id) {

        Exam exam = examMapper.selectById(id);
        if (exam == null) {
            throw new LogicException("400", "未找到题目");
        }
        Subject subject = subjectMapper.selectById(exam.getSubjectId());
        Lesson lesson = lessonMapper.selectById(exam.getLessonId());

        if (subject == null) {
            throw new LogicException("400", "无法获取该考试科目！");
        } else {
            exam.setSubject(subject);
        }

        if (lesson == null) {
            throw new LogicException("400", "无法获取该考试的班级！");
        } else {
            exam.setLesson(lesson);
        }

        return exam;
    }

    /**
     * 按课程获取考试列表
     * @param lessonId 课程id
     * @return 该课程的考试列表
     */
    public List<Exam> getExamListByLesson(int lessonId) {

        Lesson lesson = lessonMapper.selectById(lessonId);
        if (lesson == null) {
            throw new LogicException("400", "未找到课程！");
        }
        List<Exam> examList = examMapper.selectList(Wrappers.<Exam>query().lambda()
                .eq(Exam::getLessonId, lessonId)
                .orderByDesc(Exam::getStartTime));

        // 判断是否有考试开始
        startExamsOnTime(examList);
        // 判断是否有考试结束
        finishExamsOnTime(examList);

        return examList;
    }

    /**
     * 开始考试并为所有学生发放答题卡
     * @param examId 考试id
     * @return 考试信息
     */
    public Exam startExam(int examId) {
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "找不到考试！");
        }

        if (exam.getStartTime().compareTo(new Date()) > 0) {
            throw new LogicException("400", "考试未开始！");
        }

        if (exam.getEndTime().compareTo(new Date()) < 0) {
            throw new LogicException("400", "考试已结束！");
        }

        exam.setStatus(ExamStatus.STARTED.getValue());

        examMapper.updateById(exam);

        // 查找需要操作的学生
        List<Student> studentList = studentMapper.selectList(Wrappers.<Student>query().lambda()
                .inSql(Student::getId, "select student_id from lesson_student where lesson_id = " + exam.getLessonId()));

        // 依次创建答题卡
        studentList.forEach(student -> {
            examStudentService.addAnswerSheet(student.getId(), examId);
        });

        return exam;
    }

    /**
     * 结束考试
     * @param examId 考试id
     * @return 考试信息
     */
    public Exam finishExam(int examId) {
        Exam exam = examMapper.selectById(examId);
        if (exam == null) {
            throw new LogicException("400", "找不到考试！");
        }

        exam.setStatus(ExamStatus.FINISHED.getValue());

        examMapper.updateById(exam);

        // 查找需要操作的学生
        List<Student> studentList = studentMapper.selectList(Wrappers.<Student>query().lambda()
                .inSql(Student::getId, "select student_id from lesson_student where lesson_id = " + exam.getLessonId()));

        // 修改答题卡状态
        studentList.forEach(student -> {
            AnswerSheet answerSheet = answerSheetMapper.selectOne(Wrappers.<AnswerSheet>query().lambda()
                    .eq(AnswerSheet::getExamId, examId)
                    .eq(AnswerSheet::getStudentId, student.getId()));
            // 若该生创建了答题卡
            if (answerSheet != null
                    && (answerSheet.getStatus().equals(AnswerSheetStatus.ANSWERING.getValue())
                    || answerSheet.getStatus().equals(AnswerSheetStatus.UNANSWERED.getValue()) ) ) {

                answerSheet.setStatus(AnswerSheetStatus.UNMARKED.getValue());

                answerSheetMapper.updateById(answerSheet);

                markService.markObjectiveByAnswerSheet(answerSheet.getId());
            }
        });

        return exam;
    }

    /**
     * 遍历考试列表查看是否有开始的考试
     * @param examList 考试列表
     * @return 修改状态后的考试列表
     */
    public List<Exam> startExamsOnTime(List<Exam> examList) {
        examList.forEach(exam -> {
            if (exam.getStatus().equals(ExamStatus.NOTSTARTED.getValue()) && exam.getStartTime().compareTo(new Date()) <= 0 && exam.getEndTime().compareTo(new Date()) >= 0) {
                exam.setStatus(ExamStatus.STARTED.getValue());
                examMapper.updateById(exam);
                startExam(exam.getId());
            }
        });

        return examList;
    }

    /**
     * 遍历考试列表查看是否有结束的考试
     * @param examList 考试列表
     * @return 修改状态后的考试列表
     */
    public List<Exam> finishExamsOnTime(List<Exam> examList) {
        examList.forEach(exam -> {
            if (exam.getEndTime().compareTo(new Date()) <= 0 && exam.getStatus().equals(ExamStatus.STARTED.getValue())) {
                exam.setStatus(ExamStatus.FINISHED.getValue());
                examMapper.updateById(exam);
                finishExam(exam.getId());
            }
        });

        return examList;
    }
}
