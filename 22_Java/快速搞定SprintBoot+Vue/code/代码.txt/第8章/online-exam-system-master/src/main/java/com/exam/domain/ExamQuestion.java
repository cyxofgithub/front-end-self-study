package com.exam.domain;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//考试-题目辅助类
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamQuestion {

    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    @TableField("exam_id")
    private Integer examId;//考试id

    @TableField("question_id")
    private Integer questionId;//题目id

    private Double score;//分数

    private Boolean changed;//是否是副本

    private Integer bigQid;//大题号

    private Integer smallQid;//小题号

    private String bigType;//大题题型

    @TableField(exist = false)
    private Exam exam;

    @TableField(exist = false)
    private Question question;
}
