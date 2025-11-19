package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;
import java.util.List;

//考试名
@Data
public class Exam {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String name;//考试名

    @TableField("start_time")
    private Date startTime;//开始时间

    @TableField("end_time")
    private Date endTime;//结束时间

    private String status;//考试状态

    @TableField("create_time")
    private Date createTime;//考试创建时间

    @TableField("lesson_id")
    private Integer lessonId;//考试所属课程id

    @TableField("subject_id")
    private Integer subjectId;//考试所属科目id

    @TableField(exist = false)
    private Subject subject;

    @TableField(exist = false)
    private Lesson lesson;

    @TableField(exist = false)
    private List<Student> studentList;
}
