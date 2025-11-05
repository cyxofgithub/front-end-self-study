package com.example.chapter3.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.chapter3.mapper.EmployeeMapper;
import com.example.chapter3.model.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {

    public void promoteEmployee(Long id, String newPosition) {
        Employee employee = this.getById(id);
        if(employee != null) {
            employee.setPosition(newPosition);
            this.updateById(employee);
        }
    }

    @Autowired
    private EmployeeMapper employeeMapper;

    public IPage<Employee> getEmployeesByPage(int pageNo, int pageSize) {
        Page<Employee> page = new Page<>(pageNo, pageSize);
        return employeeMapper.selectPage(page, null);
    }
}

