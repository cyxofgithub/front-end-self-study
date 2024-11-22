package com.exam.domain;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

//课程-学生辅助类
@Data
public class LessonStudent {
    @TableId(type = IdType.AUTO)
    private Long id;//编号

    @TableField("lesson_id")
    private Long lessonId;//课程id

    @TableField("student_id")
    private String studentId;//学生id

    @TableField(exist = false)
    private Lesson lesson;

    @TableField(exist = false)
    private Student student;
}
