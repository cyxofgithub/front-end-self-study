package com.exam;
import com.exam.dao.StudentMapper;
import com.exam.service.StudentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class StudentTests {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentMapper studentMapper;

    @Test
    public void testStudent() {
        System.out.println(studentMapper.selectById("001"));
    }

    @Test
    public void testExam() {

    }

}
