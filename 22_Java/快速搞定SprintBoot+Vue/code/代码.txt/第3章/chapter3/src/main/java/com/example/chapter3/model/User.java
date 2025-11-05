package com.example.chapter3.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;
import java.util.List;
/*
MyBatis 使用代理来实现懒加载，
这会在实体类中添加一个名为 "handler" 的属性，但这个属性对于 JSON 序列化来说是不必要的，并且可能引发异常。
*/
@JsonIgnoreProperties(value = {"handler"})
public class User {

    private int id;
    private String username;
    private String email;
    private Date registeredDate;

    private List<Order> orders;

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    // Getter 和 Setter 方法
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(Date registeredDate) {
        this.registeredDate = registeredDate;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", registeredDate=" + registeredDate +
                ", orders=" + orders +
                '}';
    }
}
