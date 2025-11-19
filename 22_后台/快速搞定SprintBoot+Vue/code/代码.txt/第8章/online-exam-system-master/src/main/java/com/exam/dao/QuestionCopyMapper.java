package com.exam.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.exam.domain.Question;
import org.apache.ibatis.annotations.Mapper;

import java.io.Serializable;

@Mapper
public interface QuestionCopyMapper extends BaseMapper<Question> {
    int insertQuestionCopy(Question question);
    Question selectQuestionCopyById(Serializable id);
}
