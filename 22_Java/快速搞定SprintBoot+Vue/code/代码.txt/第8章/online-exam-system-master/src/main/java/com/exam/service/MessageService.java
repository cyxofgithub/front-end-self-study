package com.exam.service;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.enums.MessageType;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class MessageService {
    @Autowired
    private StudentMapper studentMapper;
    @Autowired
    private TeacherMapper teacherMapper;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private ExamMapper examMapper;
    @Autowired
    private LessonStudentMapper lessonStudentMapper;
    @Autowired
    private LessonMapper lessonMapper;


    public List<Message> getMessageList(String studentId){
        if(studentMapper.selectById(studentId)==null)
            throw new LogicException("400","不存在学生信息");
        return messageMapper.selectList(new QueryWrapper<Message>()
                .eq("student_id",studentId)
                .orderByDesc("create_time"));
    }

    @JSONField(format="yyyy-MM-dd")
    public boolean sendExamMessage(Exam exam){
        Lesson lesson=lessonMapper.selectById(exam.getLessonId());
        for(LessonStudent ls:lessonStudentMapper.selectList(new QueryWrapper<LessonStudent>()
                .eq("lesson_id",exam.getLessonId()))){
            Message message=new Message();
            message.setType(MessageType.EXAM.getValue());
            JSONObject j=new JSONObject();
            j.put("class_name",lesson.getName());
            j.put("start_time",exam.getStartTime());
            j.put("end_time",exam.getEndTime());
            j.put("exam_name",exam.getName());
            JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
            message.setContent(JSONObject.toJSONString(j, SerializerFeature.WriteDateUseDateFormat));
            message.setStudentId(ls.getStudentId());
            message.setTeacherId(lessonMapper.selectById(exam.getLessonId()).getTeacherId());
            message.setCreateTime(new Date());
            messageMapper.insert(message);
        }
        return true;
    }

    public boolean sendLessonMessage(Integer lessonId,String studentId){
        Message message=new Message();
        message.setType(MessageType.CLASS.getValue());
        Lesson lesson=lessonMapper.selectById(lessonId);
        message.setTeacherId(lesson.getTeacherId());
        message.setStudentId(studentId);
        JSONObject j=new JSONObject();
        j.put("class_name",lesson.getName());
        j.put("teacher_name",teacherMapper.selectById(lesson.getTeacherId()).getName());
        JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
        message.setContent(JSONObject.toJSONString(j, SerializerFeature.WriteDateUseDateFormat));
        message.setCreateTime(new Date());
        messageMapper.insert(message);
        return true;
    }

    public boolean sendScoreMessage(AnswerSheet answerSheet){
        Exam exam=examMapper.selectById(answerSheet.getExamId());
        Lesson lesson=lessonMapper.selectById(exam.getLessonId());
        Message message=new Message();
        message.setType(MessageType.SCORE.getValue());
        message.setStudentId(answerSheet.getStudentId());
        message.setTeacherId(lesson.getTeacherId());
        JSONObject j=new JSONObject();
        j.put("class_name",lesson.getName());
        j.put("start_time",exam.getStartTime());
        j.put("end_time",exam.getEndTime());
        j.put("exam_name",exam.getName());
        j.put("total_point",answerSheet.getTotalPoint());
        JSONObject.DEFFAULT_DATE_FORMAT="yyyy-MM-dd HH:mm:ss";
        message.setContent(JSONObject.toJSONString(j, SerializerFeature.WriteDateUseDateFormat));
        message.setCreateTime(new Date());
        messageMapper.insert(message);
        return true;
    }

}
