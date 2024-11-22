package com.exam.service;

import cn.dev33.satoken.stp.StpUtil;
import com.exam.dao.TeacherMapper;
import com.exam.domain.Student;
import com.exam.domain.Teacher;
import com.exam.domain.enums.UserStatus;
import com.exam.utils.EncryptUtil;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

@Service
public class TeacherService {

    @Autowired
    private TeacherMapper teacherMapper;

    private void setInfo(Teacher teacher){
        teacher.setSalt(UUID.randomUUID().toString());
        teacher.setPassword(EncryptUtil.md5(teacher.getPassword(),teacher.getSalt()));
        teacher.setCertified(UserStatus.CERTIFYING.getValue());
    }

    public Teacher register(String id, Teacher teacher) {

        Teacher tea = teacherMapper.selectById(teacher.getId());

        if (id == null || id.isEmpty()) {
            if (tea != null) {
                throw new LogicException("400","该账号已被注册！");
            }
            teacher.setCreateTime(new Date());
            setInfo(teacher);
            teacherMapper.insert(teacher);
            setResponse(teacher);
        } else if (id.equals(teacher.getId())) {
            teacher.setCreateTime(new Date());
            setInfo(teacher);
            teacherMapper.updateById(teacher);
            setResponse(teacher);
        } else {
            if (tea != null) {
                throw new LogicException("400","该账号已被注册！");
            }
            teacherMapper.deleteById(id);
            teacher.setCreateTime(new Date());
            setInfo(teacher);
            teacherMapper.insert(teacher);
            setResponse(teacher);
        }
        return teacher;
    }

    private void setResponse(Teacher teacher){
        teacher.setSalt(null);
        teacher.setPassword(null);
    }

    public Teacher login(String id,String password){

        Teacher teacher=teacherMapper.selectById(id);
        if (teacher==null) {
            throw new LogicException("400","账号不存在");
        }
        String pass=EncryptUtil.md5(password,teacher.getSalt());
        if (!teacher.getPassword().equals(pass)) {
            throw new LogicException("400","密码错误");
        }
        if (teacher.getCertified().equals(UserStatus.CERTIFYING.getValue())) {
            throw new LogicException("400","账号还在审核中，请联系管理员审核");
        }
        if (teacher.getCertified().equals(UserStatus.NOT_PASS.getValue())) {
            setResponse(teacher);
            return teacher;
        }
        setResponse(teacher);
        return teacher;
    }
}
