package com.exam.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.List;

//科目实体
@Data
public class Subject {
    @TableId(type = IdType.AUTO)
    private Integer id;//编号

    private String name;//科目名称

    @TableField(exist = false)//知识点
    private List<KnowledgePoint> knowledgePointList;
}
