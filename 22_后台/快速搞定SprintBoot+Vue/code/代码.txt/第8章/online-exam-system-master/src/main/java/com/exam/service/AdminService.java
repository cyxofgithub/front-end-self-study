package com.exam.service;

import cn.dev33.satoken.stp.StpUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.exam.dao.AdminMapper;
import com.exam.dao.StudentMapper;
import com.exam.dao.TeacherMapper;
import com.exam.domain.Admin;
import com.exam.domain.Question;
import com.exam.domain.Student;
import com.exam.domain.Teacher;
import com.exam.domain.enums.UserStatus;
import com.exam.utils.EncryptUtil;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    StudentMapper studentMapper;

    @Autowired
    TeacherMapper teacherMapper;

    @Autowired
    AdminMapper adminMapper;

    @Value("${file.read.path}")
    private String path;

    /**登录
     * @param id 账号
     * @param password 密码
     * @return 管理员信息
     */
    public Admin login(String id, String password){

        Admin admin=adminMapper.selectById(id);

        if(admin==null)
            throw new LogicException("400","账号不存在");

        String pass= EncryptUtil.md5(password,admin.getSalt());
        if(!admin.getPassword().equals(pass))
            throw new LogicException("400","密码错误");

        StpUtil.login(new ArrayList<String>(){{add(admin.getId());add("admin");}});

        admin.setSalt(null);
        admin.setPassword(null);

        return admin;
    }

    /**
     * 认证学生
     * @param studentId 学生id
     * @param certified 是否通过
     * @return 学生信息（除去密码盐值）
     */
    public Student studentCertify(String studentId, boolean certified){

        Student student = studentMapper.selectById(studentId);
        if(student == null)
            throw new LogicException("400","找不到该学生");

        if (certified) {
            student.setCertified(UserStatus.PASS.getValue());
        } else {
            student.setCertified(UserStatus.NOT_PASS.getValue());
        }

        studentMapper.updateById(student);

        student.setPassword("");
        student.setSalt("");

        return student;
    }


    /**
     * 认证教师
     * @param teacherId 教师id
     * @param certified 是否通过
     * @return 教师信息（除去密码盐值）
     */
    public Teacher teacherCertify(String teacherId, boolean certified){

        Teacher teacher = teacherMapper.selectById(teacherId);
        if(teacher == null)
            throw new LogicException("400","找不到该教师");

        if (certified) {
            teacher.setCertified(UserStatus.PASS.getValue());
        } else {
            teacher.setCertified(UserStatus.NOT_PASS.getValue());
        }

        teacherMapper.updateById(teacher);

        teacher.setPassword("");
        teacher.setSalt("");

        return teacher;
    }

    /**
     * 管理员从网络获取题目
     */
    public boolean getQuestion(){
        //todo 连接python
        return true;
    }

    /**
     * 管理员获取题目列表
     * @return 题目列表
     */
    public List<JSONObject> getQuestionList(){

        //todo 连接mongodb
        return null;
    }

    /**
     * 获取全部学生名单（分页）
     * @param index 页码
     * @param pageSize 每页条目数
     * @return 全部学生名单（分页）
     */
    public Page<Student> getAllStudent(int index, int pageSize) {

        Page<Student> studentList = studentMapper.selectPage(new Page(index, pageSize), Wrappers.<Student>query().lambda()
                .orderByDesc(Student::getCreateTime));
        List<Student> temp = studentList.getRecords();
        temp.forEach(student -> {
            student.setImageUrl(path + student.getImageUrl());
        });
        studentList.setRecords(temp);
        return studentList;
    }

    /**
     * 根据认证状态获取学生名单
     * @param index 页码
     * @param pageSize 每页条目数
     * @param certified 认证状态
     * @return 根据认证状态获取学生名单
     */
    public Page<Student> getStudentByCertified(int index, int pageSize, String certified) {

        Page<Student> studentList = studentMapper.selectPage(new Page(index, pageSize), Wrappers.<Student>query().lambda()
                .eq(Student::getCertified, certified)
                .orderByDesc(Student::getCreateTime));
        List<Student> temp = studentList.getRecords();
        temp.forEach(student -> {
            student.setImageUrl(path + student.getImageUrl());
        });
        studentList.setRecords(temp);
        return studentList;
    }

    /**
     * 获取全部教师名单（分页）
     * @param index 页码
     * @param pageSize 每页条目数
     * @return 全部教师名单（分页）
     */
    public Page<Teacher> getAllTeacher(int index, int pageSize) {

        Page<Teacher> teacherList = teacherMapper.selectPage(new Page(index, pageSize), Wrappers.<Teacher>query().lambda()
                .orderByDesc(Teacher::getCreateTime));
        List<Teacher> temp = teacherList.getRecords();
        temp.forEach(teacher -> {
            teacher.setImageUrl(path + teacher.getImageUrl());
        });
        teacherList.setRecords(temp);
        return teacherList;
    }

    /**
     * 根据认证状态获取教师名单
     * @param index 页码
     * @param pageSize 每页条目数
     * @param certified 认证状态
     * @return 根据认证状态获取教师名单
     */
    public Page<Teacher> getTeacherByCertified(int index, int pageSize, String certified) {

        Page<Teacher> teacherList = teacherMapper.selectPage(new Page(index, pageSize), Wrappers.<Teacher>query().lambda()
                .eq(Teacher::getCertified, certified)
                .orderByDesc(Teacher::getCreateTime));
        List<Teacher> temp = teacherList.getRecords();
        temp.forEach(teacher -> {
            teacher.setImageUrl(path + teacher.getImageUrl());
        });
        teacherList.setRecords(temp);
        return teacherList;
    }
}
