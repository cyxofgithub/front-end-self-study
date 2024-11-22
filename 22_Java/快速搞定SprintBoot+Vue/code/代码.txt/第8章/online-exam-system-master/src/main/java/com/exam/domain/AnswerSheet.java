package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
//考试名
public class AnswerSheet {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    @TableField("objective_point")
    private Double objectivePoint;//客观题得分

    @TableField("subjective_point")
    private Double subjectivePoint;//主观题得分

    @TableField("total_point")
    private Double totalPoint;//总体得分

    @TableField("create_time")
    private Date createTime;//答题卡发放时间

    @TableField("end_time")
    private Date endTime;//结束答题时间

    private String status;//答题卡状态

    @TableField("exam_id")
    private Integer examId;//答题卡所属考试id

    @TableField("student_id")
    private String studentId;//答题卡所属学生id

    @TableField(exist = false)
    private Exam exam;

    @TableField(exist = false)
    private Student student;

    @TableField(exist = false)
    private List<Answer> answerList;
}
