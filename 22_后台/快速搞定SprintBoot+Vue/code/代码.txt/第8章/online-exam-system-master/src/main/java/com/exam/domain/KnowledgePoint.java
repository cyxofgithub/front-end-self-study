package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

//知识点实体
@Data
public class KnowledgePoint {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String name;//知识点名称

    @TableField("subject_id")
    private Integer subjectId;//知识点所属科目id

    @TableField(exist = false)
    private Subject subject;
}
