package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

//题目信息
@Data
public class Question {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String stem;//题干

    private String answer;//答案

    @TableField("create_time")
    private Date createTime;//题目创建时间

    private String url;//富文本地址

    private String type;//题型

    @TableField("knowledge_point_id")
    private Integer knowledgePointId;//题目所属知识点id

    @TableField("teacher_id")
    private String teacherId;//题目所属教师id

    @TableField(exist = false)
    private KnowledgePoint knowledgePoint;

    @TableField(exist = false)
    private Teacher teacher;
}
