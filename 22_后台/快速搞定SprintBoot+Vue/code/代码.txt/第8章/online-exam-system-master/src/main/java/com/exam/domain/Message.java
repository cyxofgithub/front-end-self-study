package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

//消息实体
@Data
public class Message {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String content;//消息内容

    private String type;//消息类型

    @TableField("create_time")
    private Date createTime;//发送时间

    @TableField("teacher_id")
    private String teacherId;//课程所属教师id

    @TableField("student_id")
    private String studentId;//消息所属学生id

    @TableField(exist = false)
    private Teacher teacher;

    @TableField(exist = false)
    private Student student;
}
