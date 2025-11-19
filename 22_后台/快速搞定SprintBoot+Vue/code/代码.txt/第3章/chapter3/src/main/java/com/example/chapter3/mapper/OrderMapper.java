package com.example.chapter3.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.chapter3.model.Order;
import com.example.chapter3.model.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface OrderMapper {

    @Select("SELECT o.*, u.id as user_id, u.username, u.email, u.registered_date " +
            "FROM orders o " +
            "LEFT JOIN users u ON o.user_id = u.id " +
            "WHERE o.id = #{orderId}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "orderDate", column = "order_date"),
            @Result(property = "amount", column = "amount"),
            @Result(property = "user.id", column = "user_id"),
            @Result(property = "user.username", column = "username"),
            @Result(property = "user.email", column = "email"),
            @Result(property = "user.registeredDate", column = "registered_date"),
    })
    Order getOrderWithUser(int orderId);

    @Select("SELECT * FROM orders WHERE id = #{orderId}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "orderDate", column = "order_date"),
            @Result(property = "amount", column = "amount"),
            @Result(property = "user", column = "user_id",
                    one = @One(select = "getUserById"))
    })
    Order getOrderWithNestedUserQuery(int orderId);

    @Select("SELECT * FROM users WHERE id = #{userId}")
    User getUserById(int userId);

    //XML方式
    Order findOrderWithUser(int orderId);

}

