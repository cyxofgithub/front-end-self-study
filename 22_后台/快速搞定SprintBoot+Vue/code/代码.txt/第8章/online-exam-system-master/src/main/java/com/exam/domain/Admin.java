package com.exam.domain;

import lombok.Data;

//管理员
@Data
public class Admin {
    //    编号
    private String id;

    //    密码
    private String password;

    //    盐值
    private String salt;
}
