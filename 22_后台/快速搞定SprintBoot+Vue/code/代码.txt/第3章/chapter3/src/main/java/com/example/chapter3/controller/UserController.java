package com.example.chapter3.controller;

import com.example.chapter3.mapper.UserMapper;
import com.example.chapter3.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("/users")
@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;


    // 根据 ID 获取用户信息
    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userMapper.findUserWithOrders(id);
    }


    // 获取所有用户
    @GetMapping
    public List<User> getAllUsers() {
        return userMapper.getAllUsers();
    }
    // 新增用户
    @PostMapping
    public int insertUser(@RequestBody User user) {
        return userMapper.insertUser(user); // 返回受影响的行数
    }
    // 更新用户
    @PutMapping("/{id}")
    public int updateUser(@PathVariable int id, @RequestBody User user) {
        return userMapper.updateUser(user); // 返回受影响的行数
    }
    // 删除用户
    @DeleteMapping("/{id}")
    public int deleteUser(@PathVariable int id) {
        return userMapper.deleteUser(id); // 返回受影响的行数
    }
}
