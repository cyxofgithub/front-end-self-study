package com.example.chapter3.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.chapter3.model.Employee;
import com.example.chapter3.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/page")
    public IPage<Employee> getEmployeesByPage(
            @RequestParam(name = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(name = "pageSize", defaultValue = "5") int pageSize) {
        return employeeService.getEmployeesByPage(pageNo, pageSize);
    }
    @PostMapping("/save")
    public boolean save(Employee employee) {
        return employeeService.save(employee);
    }

    @PostMapping("/saveOrUpdate")
    public boolean saveOrUpdate(Employee employee) {
        return employeeService.saveOrUpdate(employee);
    }

    @DeleteMapping("/remove/{id}")
    public boolean remove(@PathVariable Long id) {
        return employeeService.removeById(id);
    }

    @PutMapping("/update")
    public boolean update(Employee employee) {
        return employeeService.updateById(employee);
    }

    @GetMapping("/get/{id}")
    public Employee get(@PathVariable Long id) {
        return employeeService.getById(id);
    }

    @GetMapping("/list")
    public List<Employee> list() {
        return employeeService.list();
    }
}
