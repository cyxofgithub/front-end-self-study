package com.exam.service;

import cn.dev33.satoken.stp.StpUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.exam.dao.StudentMapper;
import com.exam.domain.Exam;
import com.exam.domain.Student;
import com.exam.domain.Subject;
import com.exam.domain.enums.UserStatus;
import com.exam.utils.EncryptUtil;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class StudentService {

    @Autowired
    private StudentMapper studentMapper;

    @Value("${file.read.path}")
    private String path;

    private void setInfo(Student student){
        student.setSalt(UUID.randomUUID().toString());
        student.setPassword(EncryptUtil.md5(student.getPassword(),student.getSalt()));
        student.setCertified(UserStatus.CERTIFYING.getValue());
    }

    public Student register(String id, Student student) {

        Student stu = studentMapper.selectById(student.getId());
        if (stu != null && stu.getCertified().equals(UserStatus.PASS.getValue())) {
            throw new LogicException("400","该账号已被注册！");
        }
        if (id == null || id.isEmpty()) {
            // 首次注册
            student.setCreateTime(new Date());
            setInfo(student);
            studentMapper.insert(student);
            setResponse(student);
        } else if (id.equals(student.getId())) {
            // 修改信息时未修改id
            student.setCreateTime(new Date());
            setInfo(student);
            studentMapper.updateById(student);
            setResponse(student);
        } else {
            // 修改信息时修改了id
            studentMapper.deleteById(id);
            student.setCreateTime(new Date());
            setInfo(student);
            studentMapper.insert(student);
            setResponse(student);
        }
        return student;
    }

    private void setResponse(Student student){
        student.setSalt(null);
        student.setPassword(null);
    }

    public Student login(String id,String password){

        Student student=studentMapper.selectById(id);
        if (student==null) {
            throw new LogicException("400","账号不存在");
        }
        String pass=EncryptUtil.md5(password,student.getSalt());
        if (!student.getPassword().equals(pass)) {
            throw new LogicException("400","密码错误");
        }
        if (student.getCertified().equals(UserStatus.CERTIFYING.getValue())) {
            throw new LogicException("400","账号还在审核中，请联系管理员审核");
        }
        if (student.getCertified().equals(UserStatus.NOT_PASS.getValue())) {
            setResponse(student);
            return student;
        }
        StpUtil.login(new ArrayList<String>(){{add(student.getId());add("student");}});
        setResponse(student);

        return student;
    }

    public Student getStudentInfo(String id) {

        Student student = studentMapper.selectOne(new QueryWrapper<Student>()
                .eq("id",id)
                .select("id","name","image_url"));
        if (student == null) {
            throw new LogicException("400", "找不到学生！");
        }
        student.setImageUrl(path + student.getImageUrl());
        return student;
    }
}
