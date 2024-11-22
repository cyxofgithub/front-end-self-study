package com.exam.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.exam.dao.*;
import com.exam.domain.AnswerSheet;
import com.exam.domain.Exam;
import com.exam.domain.Student;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private AnswerSheetMapper answerSheetMapper;
    @Autowired
    private StudentMapper studentMapper;


    public List<AnswerSheet> getGradeByStudent(String studentId) {
        List<AnswerSheet> answerSheets=answerSheetMapper.selectList(new QueryWrapper<AnswerSheet>()
                .inSql("exam_id", "select id from exam where status = '" + ExamStatus.MARKED.getValue() + "'")
                .eq("status", AnswerSheetStatus.MARKED.getValue() )
                .eq("student_id",studentId)
                .select("exam_id","student_id","total_point"));
        Student student=studentMapper.selectOne(new QueryWrapper<Student>().eq("id",studentId).select("id","name"));
        answerSheets.forEach(answerSheet ->
        {
            Exam exam=examMapper.selectOne(new QueryWrapper<Exam>().eq("id",answerSheet.getExamId()).
                            select("start_time","end_time","name","lesson_id"));
            exam.setLesson(lessonMapper.selectById(exam.getLessonId()));
            answerSheet.setExam(exam);
        });

        return answerSheets;
    }

    public List<AnswerSheet> getGradeByExam(Integer examId) {
        List<AnswerSheet> answerSheets=answerSheetMapper.selectList(new QueryWrapper<AnswerSheet>()
                .eq("exam_id",examId)
                .select("exam_id","student_id","total_point","status"));
        answerSheets.forEach(x->x.setStudent(studentMapper.selectOne(
                new QueryWrapper<Student>().eq("id",x.getStudentId()).select("name", "id"))));
        return answerSheets;
    }

}
