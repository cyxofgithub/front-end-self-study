package com.example.chapter3.mapper;

import com.example.chapter3.model.Order;
import com.example.chapter3.model.User;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.mapping.FetchType;

import java.util.List;

public interface UserMapper {

    //@Select("SELECT * FROM users WHERE id = #{id}")
    User getUserById(int id);

    // 插入新用户
    //@Insert("INSERT INTO users(username, email,registered_date) VALUES(#{username}, #{email}, #{registeredDate})")
    int insertUser(User user); // 返回插入操作的影响行数

    // 更新用户
    //@Update("UPDATE users SET username = #{username}, email = #{email} WHERE id = #{id}")
    int updateUser(User user); // 返回更新操作的影响行数

    // 删除用户
    //@Delete("DELETE FROM users WHERE id = #{id}")
    int deleteUser(int id); // 返回删除操作的影响行数

    // 查询所有用户
    @Select("SELECT * FROM users")
    List<User> getAllUsers();

    // 查询用户及其所有订单
    @Select("SELECT * FROM users WHERE id = #{userId}")
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "username", column = "username"),
            @Result(property = "email", column = "email"),
            @Result(property = "registeredDate", column = "registered_date"),
            @Result(property = "orders", javaType = List.class, column = "id",
                    many = @Many(select = "getOrdersByUserId"))
    })
    User getUserWithOrders(int userId);

    // 根据用户ID查询订单
    @Select("SELECT * FROM orders WHERE user_id = #{userId}")
    List<Order> getOrdersByUserId(int userId);

    //懒加载
    @Select("SELECT * FROM users WHERE id = #{userId}")
    @Results({
            @Result(id=true, property="id", column="id"),
            @Result(property="username", column="username"),
            @Result(property="orders", column="id", javaType=List.class,
                    many=@Many(select="getOrdersByUserId", fetchType= FetchType.LAZY))
    })
    User getUserWithLazyOrders(int userId);

    //关联xml
    User findUserWithOrders(int userId);

}

