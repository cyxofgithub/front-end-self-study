package com.exam;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.DTO.GradeChartsDTO;
import com.exam.domain.enums.ExamStatus;
import com.exam.domain.enums.QuestionType;
import com.exam.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ExamTests {

    @Autowired
    private MarkService markService;

    @Autowired
    private ExamStudentService examStudentService;

    @Autowired
    private ExamTeacherService examTeacherService;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private ExamPaperService examPaperService;

    @Autowired
    private KnowledgePointMapper knowledgePointMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private GradeService gradeService;

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private QuestionCopyMapper questionCopyMapper;

    @Autowired
    private ExamQuestionMapper examQuestionMapper;

    @Autowired
    private ExamService examService;

    @Test
    public void testExam() {
        examMapper.selectById(1);
//        examService.getExamListByLesson(1);
    }

    @Test
    public void testQuestion() {
        System.out.println(questionService.getQuestionList(0, 10).getTotal());
        System.out.println(questionService.getQuestionList(0, 10).getRecords());
    }

    @Test
    public void testKnowledgePoint() {
        List<KnowledgePoint> knowledgePointList = knowledgePointMapper.selectList(Wrappers.<KnowledgePoint>query().lambda().select(KnowledgePoint::getId));
        System.out.println(knowledgePointList);
    }

    @Test
    public void testExamStudent() {
        System.out.println(examStudentService.getExamListByStudent("001"));
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
        examMapper.insert(exam);
        System.out.println(messageService.sendExamMessage(exam));
    }

    @Test
    public void testScoreMessage(){
//        AnswerSheet answerSheet=new AnswerSheet();
//        answerSheet.setExamId(1);
//        answerSheet.setId(1);
//        answerSheet.setTotalPoint(35.00);
//        answerSheet.setStudentId("001");
//        messageService.sendScoreMessage(answerSheet);
    }

    @Test
    public void testAddExam() throws ParseException {
        Exam exam = new Exam();
        exam.setName("2022年软件工程期中考试");
        exam.setLessonId(2);
        exam.setSubjectId(2);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        exam.setStartTime(sdf.parse("2022-7-11 17:00:00"));
        exam.setEndTime(sdf.parse("2022-7-11 19:00:00"));

        System.out.println(examPaperService.addExam(exam));
    }

    @Test
    public void testAddQuestionToPaper() {
        List<Question[]> res = new ArrayList<>();

        Question[] questions = new Question[2];
        Question question = questionService.getQuestionById(1);
        question.setId(null);
        questions[0] = question;
        question = questionService.getQuestionById(2);
        question.setId(null);
        questions[1] = question;

        res.add(questions);

        questions = new Question[1];
        question = questionService.getQuestionById(5);
        question.setId(null);
        questions[0] = question;

        res.add(questions);

        List<Boolean[]> isCopy = new ArrayList<>();
        Boolean[] b = {true, true};
        isCopy.add(b);
        b = new Boolean[]{true};
        isCopy.add(b);

        List<Double[]> scoreList = new ArrayList<Double[]>();
        Double[] d = {30.0, 30.0};
        scoreList.add(d);
        d = new Double[]{40.0};
        scoreList.add(d);

        List<String> bigTypeList = new ArrayList<String>();
        String s = "填空题";
        bigTypeList.add(s);
        s = "简答题";
        bigTypeList.add(s);

        examPaperService.addManualQuestionList(2, res, isCopy, scoreList, bigTypeList);
    }

    @Test
    public void testPostAnswerSheet() {
        examStudentService.addAnswerSheet("001", 2);
    }

    @Test
    public void testStartExam() {
        examService.startExam(2);
    }

    @Test
    public void testFinishExam() {
        examService.finishExam(1);
    }

    @Test
    public void testFinishAnswerSheet() {
//        examStudentService.finishAnswerSheet(1);
    }

    @Test
    public void testUpdateAnswer() {
        Answer answer = answerMapper.selectById(12);
        answer.setContent("RFID");
//        examStudentService.updateAnswer(answer);
    }

    @Test
    public void testCopyMapper() {
        System.out.println(questionCopyMapper.selectQuestionCopyById(1));
    }

    @Test
    public void testExamQuestion() {
        ExamQuestion examQuestion = new ExamQuestion(null, 2, 5, 10.0, true, 1, 0, "简答题", null, null);
        System.out.println(examQuestionMapper.insert(examQuestion));
    }

    @Test
    public void testGetExamScore(){
        gradeService.getGradeByExam(1).forEach(x->System.out.println(x));
    }

    @Test
    public void testNumGrade(){
        GradeChartsDTO dto= analysisService.getStudentGradeByNum("001");
    }


    @Test
    public void testGradeTrend(){
        GradeChartsDTO dto=analysisService.getGradeTrend("001",1);
    }

    @Test
    public void testMark() {
//        markService.markObjectiveByAnswerSheet(1);
//        markService.markSubjectiveById(17, 30);
        markService.publishGrade(1);
    }

    @Test
    public void testExamWithStudent() {
        System.out.println(examTeacherService.getExamWithStudent(1));
    }

    @Test
    public void testNewExamInfo() {
        examStudentService.getExamInfo(4, "003").forEach(System.out::println);
    }

    @Test
    public void testFilling() {
//        AnswerSheet answerSheet = new AnswerSheet();
//        answerSheet.setId(123);
//        examStudentService.addAnswer(answerSheet, 21);

        System.out.println(messageService.getMessageList("001"));
    }

    @Test
    public void testAuto() {

        Question question = new Question();
//        question.setType("多选题");
//        question.setAnswer("1,0,2");
        question.setType("填空题");
        question.setAnswer("11,22,22");

        Answer answer = new Answer();
//        answer.setContent("0,1");
        answer.setContent("11,,22");

        if (question.getType().equals(QuestionType.SINGLE.getValue()) || question.getType().equals(QuestionType.CHECK.getValue())) {
            // 单选题和判断题批阅
            if (answer.getContent().equals(question.getAnswer())) {
                double point = 100;
                answer.setPointGet(point);
            } else {
                answer.setPointGet(0.0);
            }
        } else if (question.getType().equals(QuestionType.FILLING.getValue())) {
            // 填空题批阅
            double point = 100;

            String temp = answer.getContent().replaceAll(",,", ", ,");

            String[] answerTemp = temp.split(",");
            String[] questionTemp = question.getAnswer().split(",");

            int pointGet = 0;

            if (answerTemp.length == questionTemp.length) {
                for (int i = 0; i < answerTemp.length; i++) {
                    if (answerTemp[i].equals(questionTemp[i])) {
                        pointGet++;
                    }
                }
                answer.setPointGet((1.0 * pointGet / answerTemp.length) * point);
            } else {
                answer.setPointGet(0.0);
            }
        } else if (question.getType().equals(QuestionType.MULTIPLE.getValue())) {
            // 多选题批阅
            double point = 100;

            String[] answerTemp = answer.getContent().split(",");
            String[] questionTemp = question.getAnswer().split(",");

            if (answerTemp.length > questionTemp.length) {
                answer.setPointGet(0.0);
            } else if (answerTemp.length == questionTemp.length) {
                for (String s : answerTemp) {
                    if (!question.getAnswer().contains(s)) {
                        answer.setPointGet(0.0);
                        break;
                    } else {
                        answer.setPointGet(point);
                    }
                }
            } else {
                if(answerTemp[0].equals("")){
                    answer.setPointGet(0.0);
                } else {
                    for (String s : answerTemp) {
                        if (!question.getAnswer().contains(s)) {
                            answer.setPointGet(0.0);
                            break;
                        } else {
                            answer.setPointGet(point / 2);
                        }
                    }
                }
            }
        }

        System.out.println(answer);
    }
}
