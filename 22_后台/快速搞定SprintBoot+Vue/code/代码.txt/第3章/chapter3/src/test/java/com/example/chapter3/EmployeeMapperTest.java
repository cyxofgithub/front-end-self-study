package com.example.chapter3;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.example.chapter3.mapper.EmployeeMapper;
import com.example.chapter3.model.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class EmployeeMapperTest {
    @Autowired
    private EmployeeMapper employeeMapper;

    @Test
    public void testSelect() {
        // 根据 ID 查询
        Employee employee = employeeMapper.selectById(1);
        assertNotNull(employee, "ID 为 1 的员工应该存在。");

        // 查询所有员工
        List<Employee> employees = employeeMapper.selectList(null);
        assertFalse(employees.isEmpty(), "数据库中应该有一个或多个员工记录。");

        // 创建一个新的员工对象
        Employee newEmployee = new Employee();
        newEmployee.setFirstName("John");
        newEmployee.setLastName("Doe");
        newEmployee.setPosition("Software Engineer");
        newEmployee.setDepartment("Engineering");
        newEmployee.setHireDate(new Date()); // 设置雇佣日期为当前日期或适当日期

        // 插入员工记录
        int result = employeeMapper.insert(newEmployee);

        // 验证插入是否成功
        assertEquals(1, result, "员工记录应成功插入。");
    }

    @Test
    public void testQueryWrapper() {
        QueryWrapper<Employee> queryWrapper = new QueryWrapper<>();
        // 设置查询的字段
        queryWrapper.select("first_name", "last_name", "position");
        // 添加where条件
        queryWrapper.eq("department", "IT").lt("hire_date", "2023-01-01");
        // 执行查询
        List<Employee> employees = employeeMapper.selectList(queryWrapper);
        System.out.println(employees);
    }

    public void testUpdateWrapper() {
        UpdateWrapper<Employee> updateWrapper = new UpdateWrapper<>();
        // 设置更新条件
        updateWrapper.eq("department", "IT");
        // 设置更新的字段
        updateWrapper.set("position", "Senior Software Engineer");
        // 执行更新
        int result = employeeMapper.update(null, updateWrapper);

    }

    public void testAndOr() {
        QueryWrapper<Employee> queryWrapper1 = new QueryWrapper<>();
        queryWrapper1.eq("department", "IT").and(i -> i.lt("hire_date", "2023-01-01").or().like("position", "Engineer"));

        QueryWrapper<Employee> queryWrapper2 = new QueryWrapper<>();
        queryWrapper2.eq("department", "IT").or().like("position", "Manager");

    }
}
