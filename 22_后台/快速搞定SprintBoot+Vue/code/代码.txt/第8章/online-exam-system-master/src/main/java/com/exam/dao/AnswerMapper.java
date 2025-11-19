package com.exam.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.exam.domain.Answer;
import com.exam.domain.Exam;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnswerMapper extends BaseMapper<Answer> {

}
