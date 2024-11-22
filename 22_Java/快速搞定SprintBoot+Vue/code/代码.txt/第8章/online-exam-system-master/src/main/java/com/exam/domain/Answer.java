package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
//学生回答信息
public class Answer {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String content;//学生回答

    @TableField("point_get")
    private Double pointGet;//得分

    @TableField("create_time")
    private Date createTime;//回答创建时间

    @TableField("question_id")
    private Integer questionId;//题目所属知识点id

    @TableField("answer_sheet_id")
    private Integer answerSheetId;//题目所属教师id

    @TableField(exist = false)
    private Question question;

    @TableField(exist = false)
    private AnswerSheet answerSheet;
}
