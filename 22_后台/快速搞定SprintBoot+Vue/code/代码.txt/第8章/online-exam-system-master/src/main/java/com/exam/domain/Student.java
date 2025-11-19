package com.exam.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.util.Date;

//学生实体
@Data
public class Student {
    private String id;//编号

    private String name;//姓名

    private String password;//密码

    private String certified;//认证状态

    private String salt;//盐值

    @TableField("create_time")
    private Date createTime;//创建时间

    @TableField("image_url")
    private String imageUrl;//图片路径
}
