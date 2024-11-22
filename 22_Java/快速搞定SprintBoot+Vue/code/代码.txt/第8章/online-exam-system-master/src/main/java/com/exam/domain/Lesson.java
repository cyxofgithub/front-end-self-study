package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

//班级实体
@Data
public class Lesson {
    @TableId(type = IdType.AUTO)
    private Long id;//编号

    private String name;//课程名称

    private String uuid;//课程邀请码

    @TableField("teacher_id")
    private String teacherId;//课程所属教师id

    @TableField("subject_id")
    private int subjectId;//科目id

    @TableField(exist = false)
    private Teacher teacher;

    @TableField(exist = false)
    private Subject subject;

    @TableField(exist = false)
    private Long count;
}
