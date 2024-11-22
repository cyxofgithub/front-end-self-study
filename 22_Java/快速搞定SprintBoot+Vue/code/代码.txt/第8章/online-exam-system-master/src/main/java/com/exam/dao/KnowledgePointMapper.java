package com.exam.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.exam.domain.Exam;
import com.exam.domain.KnowledgePoint;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface KnowledgePointMapper extends BaseMapper<KnowledgePoint> {

}
