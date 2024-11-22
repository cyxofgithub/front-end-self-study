package com.exam.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.DTO.LessonDTO;
import com.exam.domain.enums.ExamStatus;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LessonService {

    @Autowired
    StudentMapper studentMapper;
    @Autowired
    LessonStudentMapper lessonStudentMapper;
    @Autowired
    LessonMapper lessonMapper;
    @Autowired
    TeacherMapper teacherMapper;
    @Autowired
    private MessageService messageService;
    @Autowired
    private ExamMapper  examMapper;

    public boolean join(String studentId, String uuid){
        Student student= studentMapper.selectById(studentId);
        Lesson lesson=lessonMapper.selectOne(new QueryWrapper<Lesson>().eq("uuid",uuid));
        if(student==null)
            throw new LogicException("400","不存在学生信息");
        if(lesson==null)
            throw new LogicException("400","不存在班级信息");
        if(lessonStudentMapper.selectOne(new QueryWrapper<LessonStudent>().eq("lesson_id",lesson.getId())
                .eq("student_id",student.getId()))!=null)
            throw new LogicException("400","已加入该班级");
        LessonStudent lessonStudent=new LessonStudent();
        lessonStudent.setLessonId(lesson.getId());
        lessonStudent.setStudentId(studentId);
        lessonStudentMapper.insert(lessonStudent);
        return true;
    }

    public Lesson addLesson(String name, int subjectId, String teacherId){
        if(teacherMapper.selectById(teacherId)==null)
            throw new LogicException("400","不存在教师信息");
        Lesson lesson=new Lesson();
        lesson.setName(name);
        lesson.setTeacherId(teacherId);
        lesson.setSubjectId(subjectId);
        // 设置班级邀请码
        String uuid = UUID.randomUUID().toString().split("-")[0];
        int count = 10;
        while (count > 0 && lessonMapper.selectOne(Wrappers.<Lesson>query().lambda().eq(Lesson::getUuid, uuid)) != null) {
            uuid = UUID.randomUUID().toString().split("-")[0];
            count--;
        }
        lesson.setUuid(uuid);

        lessonMapper.insert(lesson);
        return lesson;
    }

    public List<Lesson> getLessonListByTeacherId(String teacherId){
        if(teacherMapper.selectById(teacherId)==null)
            throw new LogicException("400","不存在教师信息");
        List<Lesson> list= lessonMapper.selectList(new QueryWrapper<Lesson>().eq("teacher_id",teacherId));
        list.forEach(lesson -> {

            lesson.setCount(lessonStudentMapper.selectCount(new QueryWrapper<LessonStudent>()
                .eq("lesson_id",lesson.getId())));
        });
        return list;
    }

    public Lesson getLessonById(Integer id){
        Lesson lesson=lessonMapper.selectById(id);
        if(lesson==null)
            throw new LogicException("400","不存在班级信息");
        return lesson;
    }

    public List<Student> getStudentByLessonId(Integer lessonId){
        if(lessonMapper.selectById(lessonId)==null)
            throw new LogicException("400","不存在班级信息");

        List<LessonStudent> lessonStudents=lessonStudentMapper.selectList(new QueryWrapper<LessonStudent>().eq("lesson_id",lessonId));
        if(lessonStudents.isEmpty())
            return null;
        List<String> ids=lessonStudents.stream().map(LessonStudent::getStudentId).collect(Collectors.toList());

        return studentMapper.selectList(new QueryWrapper<Student>().select("name","id").in("id",ids));
    }

    public boolean deleteStudentInLesson(Integer lessonId,String studentId){
        if(lessonMapper.selectById(lessonId)==null)
            throw new LogicException("400","不存在班级信息");
        LessonStudent lessonStudent=lessonStudentMapper.selectOne(new QueryWrapper<LessonStudent>().eq("lesson_id",lessonId)
                .eq("lesson_id",lessonId));
        messageService.sendLessonMessage(lessonId,studentId);
        lessonStudentMapper.deleteById(lessonStudent.getId());
        return true;
    }

    public List<LessonDTO> getLessonListByStudentId(String studentId){
        if(studentMapper.selectById(studentId)==null)
            throw new LogicException("400","不存在学生信息");
        List<Long> ids=lessonStudentMapper.selectList(new QueryWrapper<LessonStudent>().eq("student_id",studentId))
                .stream().map(LessonStudent::getLessonId).collect(Collectors.toList());
        List<Lesson> lesson=lessonMapper.selectBatchIds(ids);
        List<LessonDTO> lessonDTOS=new ArrayList<>();
        lesson.forEach(lesson1 -> {
            lesson1.setTeacher(teacherMapper.selectOne(new QueryWrapper<Teacher>().eq("id",
                    lesson1.getTeacherId()).select("name")));
            lesson1.setCount(lessonStudentMapper.selectCount(new QueryWrapper<LessonStudent>()
                    .eq("lesson_id",lesson1.getId())));
            lessonDTOS.add(generateLessonDTO(lesson1));
        });
        return lessonDTOS;
    }

    private LessonDTO generateLessonDTO(Lesson lesson){
        return new LessonDTO(lesson,
                examMapper.selectCount(new QueryWrapper<Exam>()
                        .eq("lesson_id",lesson.getId()).eq("status", ExamStatus.NOTSTARTED.getValue())),
                examMapper.selectCount(new QueryWrapper<Exam>()
                        .eq("lesson_id",lesson.getId()).eq("status", ExamStatus.STARTED.getValue())),
                examMapper.selectCount(new QueryWrapper<Exam>()
                        .eq("lesson_id",lesson.getId()).eq("status", ExamStatus.FINISHED.getValue())),
                examMapper.selectCount(new QueryWrapper<Exam>()
                        .eq("lesson_id",lesson.getId()).eq("status", ExamStatus.MARKED.getValue()))
        );
    }

}
