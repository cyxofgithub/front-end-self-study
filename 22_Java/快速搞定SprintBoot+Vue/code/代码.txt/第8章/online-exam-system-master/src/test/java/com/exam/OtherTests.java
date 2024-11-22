package com.exam;

import cn.dev33.satoken.stp.SaLoginModel;
import cn.dev33.satoken.stp.StpUtil;
import com.exam.dao.ExamMapper;
import com.exam.domain.AnswerSheet;
import com.exam.domain.DTO.GradeChartsDTO;
import com.exam.domain.DTO.KnowledgePointDTO;
import com.exam.domain.Exam;
import com.exam.domain.Message;
import com.exam.domain.enums.ExamStatus;
import com.exam.service.AnalysisService;
import com.exam.service.MarkService;
import com.exam.service.MessageService;
import org.apache.log4j.Logger;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Date;
import java.util.List;


@RunWith(SpringRunner.class)
@SpringBootTest
class OtherTests {
    static Logger logger = Logger.getLogger(OtherTests.class);
    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private MarkService markService;
    @Autowired
    private MessageService messageService;

    @Autowired
    private AnalysisService analysisService;
    @Test
    public void testLog4j(){
        //我们就可以通过不同的日志级别来输出我们想要输出的内容了
        logger.info("info");
        logger.debug("debug");
        logger.error("error");
    }

    @Test
    public void testToken(){
        StpUtil.login("123456");
        System.out.println(StpUtil.hasPermission("user-update"));
    }


    @Test
    public void testExamMessage(){
            Exam exam=new Exam();
            exam.setLessonId(1);
            exam.setSubjectId(1);
            exam.setCreateTime(new Date());
            exam.setStartTime(new Date());
            exam.setEndTime(new Date());
            exam.setId(1);
            exam.setName("物联网考试考试");
            exam.setStatus(ExamStatus.NOTSTARTED.getValue());
            System.out.println(messageService.sendExamMessage(exam));
    }

    @Test
    public void testGetMessage(){
        String studentId="001";
        List<Message> messages=messageService.getMessageList(studentId);
        messages.forEach(x->System.out.println(x));
    }

    @Test
    public void testScoreMessage(){
        AnswerSheet answerSheet=new AnswerSheet(null,20.00,20.00,40.00,new Date(),new Date(),ExamStatus.STARTED.getValue(), 1,"001",null,null,null);
        messageService.sendScoreMessage(answerSheet);
    }

    @Test
    public void testLessonMessage(){
        AnswerSheet answerSheet=new AnswerSheet(null,20.00,20.00,40.00,new Date(),new Date(),ExamStatus.STARTED.getValue(), 1,"001",null,null,null);
        messageService.sendLessonMessage(2,"001");
    }

    @Test
    public void testLeiDa(){
        GradeChartsDTO<KnowledgePointDTO ,Double> re= analysisService.getAllKnowledgeGradeByLessonId(1,"001");
        System.out.println(re);
    }

    @Test
    public  void testMark(){
        markService.markObjectiveById(14,233);
    }




}
