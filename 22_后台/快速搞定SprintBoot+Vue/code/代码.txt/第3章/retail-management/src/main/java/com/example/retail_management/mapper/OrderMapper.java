package com.example.retail_management.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.retail_management.model.Order;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    // MyBatis Plus 提供基础 CRUD 操作
    // 可以添加自定义查询或操作
}