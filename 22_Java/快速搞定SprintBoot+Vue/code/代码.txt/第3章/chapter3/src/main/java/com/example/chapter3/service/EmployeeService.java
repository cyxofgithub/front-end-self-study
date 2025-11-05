package com.example.chapter3.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.chapter3.model.Employee;

public interface EmployeeService extends IService<Employee> {
    IPage<Employee> getEmployeesByPage(int pageNo, int pageSize);
}
