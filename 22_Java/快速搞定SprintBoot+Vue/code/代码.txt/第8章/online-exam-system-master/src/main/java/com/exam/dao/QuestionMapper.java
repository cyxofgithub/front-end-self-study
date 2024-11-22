package com.exam.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.exam.domain.Exam;
import com.exam.domain.Question;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper extends BaseMapper<Question> {

}
