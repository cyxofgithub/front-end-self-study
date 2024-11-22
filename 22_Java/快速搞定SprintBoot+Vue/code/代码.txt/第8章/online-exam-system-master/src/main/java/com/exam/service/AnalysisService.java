package com.exam.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.DTO.GradeChartsDTO;
import com.exam.domain.DTO.KnowledgePointDTO;
import com.exam.domain.enums.AnswerSheetStatus;
import com.exam.domain.enums.ExamStatus;
import com.exam.utils.LogicException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalysisService {

    @Autowired
    private AnswerSheetMapper answerSheetMapper;

    @Autowired
    private ExamMapper examMapper;

    @Autowired
    private LessonMapper lessonMapper;

    @Autowired
    private LessonStudentMapper lessonStudentMapper;

    @Autowired
    private ExamQuestionMapper examQuestionMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private QuestionCopyMapper questionCopyMapper;

    @Autowired
    private AnswerMapper answerMapper;

    @Autowired
    private KnowledgePointMapper knowledgePointMapper;
    /**
     *
     * @param answerSheetList
     * @return
     */
    private GradeChartsDTO<String,Integer> getStudentNum(List<AnswerSheet> answerSheetList){
        if(answerSheetList==null)
            throw new LogicException("400","已批阅的答题卡数量为0");
        if(answerSheetList.size()==0)
            throw new LogicException("400","已批阅的答题卡数量为0");
        List<Integer> series=new ArrayList<Integer>();
        List<String> xAxis=new ArrayList<>();
        List<AnswerSheet> filter = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 0 && s.getTotalPoint()< 60).
                collect(Collectors.toList());
        series.add(filter.size());
        xAxis.add("不及格");
        List<AnswerSheet> filter1 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 60 && s.getTotalPoint()< 70).
                collect(Collectors.toList());
        series.add(filter1.size());
        xAxis.add("60-69");
        List<AnswerSheet> filter2 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 70 && s.getTotalPoint()< 80).
                collect(Collectors.toList());
        series.add(filter2.size());
        xAxis.add("70-79");
        List<AnswerSheet> filter3 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 80 && s.getTotalPoint()< 85).
                collect(Collectors.toList());
        series.add(filter3.size());
        xAxis.add("80-84");
        List<AnswerSheet> filter4 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 85 && s.getTotalPoint()< 90).
                collect(Collectors.toList());
        series.add(filter4.size());
        xAxis.add("85-89");
        List<AnswerSheet> filter5 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 90 && s.getTotalPoint()< 95).
                collect(Collectors.toList());
        series.add(filter5.size());
        xAxis.add("90-94");
        List<AnswerSheet> filter6 = answerSheetList.stream().
                filter(s->s.getTotalPoint()>= 95 && s.getTotalPoint()<=100).
                collect(Collectors.toList());
        series.add(filter6.size());
        xAxis.add("95-100");
        return new GradeChartsDTO<>(xAxis,series);
    }

    /**
     *
     * @param studentId
     * @return
     */
    public GradeChartsDTO<String,Integer> getStudentGradeByNum(String studentId){
        List<AnswerSheet> answerSheetList= answerSheetMapper.
                selectList(new QueryWrapper<AnswerSheet>()
                        .eq("status", AnswerSheetStatus.MARKED.getValue())
                        .eq("student_id",studentId));
        return getStudentNum(answerSheetList);
    }

    /**
     *
     * @param studentId
     * @param lessonId
     * @return
     */
    public GradeChartsDTO<Integer,Double> getGradeTrend(String studentId,Integer lessonId){
        if(lessonMapper.selectById(lessonId)==null)
            throw new LogicException("400","未找到该班级");
        List<Exam> exams=examMapper.selectList(new QueryWrapper<Exam>().eq("lesson_id",lessonId));

        if (exams.size()==0) {
            return null;
        }

        List<Integer> examIds=
                exams.stream().map(Exam::getId).collect(Collectors.toList());
        List<AnswerSheet> answerSheets=answerSheetMapper.selectList(new QueryWrapper<AnswerSheet>()
                .eq("status", AnswerSheetStatus.MARKED.getValue())
                .eq("student_id",studentId)
                .in("exam_id",examIds).orderByAsc("create_time"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        List<Integer> xAxis=new ArrayList<>();
        List<Double> grades=new ArrayList<>();
        final int[] i = {0};
        answerSheets.forEach(x->{
            grades.add(x.getTotalPoint());
            xAxis.add(++i[0]);
            System.out.println(formatter.format(x.getCreateTime()));
        });
        return new GradeChartsDTO<>(xAxis,grades);
    }

    /**
     *
     * @param lessonId
     * @return
     */
    public GradeChartsDTO<String,Integer> getAllGradeByLessonId(Integer lessonId){
        if(lessonMapper.selectById(lessonId)==null)
            throw new LogicException("400","未找到该班级");

        List<Exam> exams=examMapper.selectList(new QueryWrapper<Exam>().
                eq("lesson_id",lessonId));

        if (exams.size()==0) {
            return null;
        }

        List<Integer> examIds=exams.stream().map(Exam::getId).collect(Collectors.toList());
        List<String> studentIds= lessonStudentMapper.selectList(new QueryWrapper<LessonStudent>().eq("lesson_id",lessonId))
                .stream().map(LessonStudent::getStudentId).collect(Collectors.toList());

        if (examIds.size() == 0 || studentIds.size() == 0) {
            return null;
        }

        List<AnswerSheet> answerSheets=answerSheetMapper.selectList(new QueryWrapper<AnswerSheet>()
                .eq("status", AnswerSheetStatus.MARKED.getValue())
                .in("student_id",studentIds).in("exam_id",examIds));

        if (answerSheets.size() == 0) {
            return null;
        }

        return getStudentNum(answerSheets);
    }

    /**
     *
     * @param examId
     * @return
     */
    public GradeChartsDTO<String,Integer> getAllGradeByExamId(Integer examId){

        if (examMapper.selectById(examId) == null) {
            throw new LogicException("400", "考试不存在！");
        }

        List<String> studentIds= lessonStudentMapper.
                selectList(new QueryWrapper<LessonStudent>().eq("lesson_id",
                        examMapper.selectById(examId).getLessonId())).stream().
                map(LessonStudent::getStudentId).collect(Collectors.toList());
        List<AnswerSheet> answerSheets=answerSheetMapper.selectList(new QueryWrapper<AnswerSheet>()
                .eq("status", AnswerSheetStatus.MARKED.getValue())
                .in("student_id",studentIds).eq("exam_id",examId));

        if (answerSheets.size() == 0) {
            return null;
        }

        return getStudentNum(answerSheets);
    }


    /**雷达图的
     * label属性返回值
     * @param examQuestion
     * @param label
     */
    private void generateLabel(ExamQuestion examQuestion,List<KnowledgePointDTO> label,String studentId,
                               List<Double> pointGet){
        KnowledgePointDTO kp=new KnowledgePointDTO(knowledgePointMapper.selectById(
                examQuestion.getQuestion().getKnowledgePointId()).getName(),0.00);
        Integer labelIndex=label.indexOf(kp);
        Double point=generatePointGet(examQuestion,studentId);
        if(labelIndex>-1){
            KnowledgePointDTO current= label.get(labelIndex);
            current.setMax(current.getMax()+examQuestion.getScore());

            pointGet.set(labelIndex,point+pointGet.get(labelIndex));
        }
        else{
            kp.setMax(examQuestion.getScore());
            label.add(kp);
            pointGet.add(point);
        }
    }

    /**
     *
     * @param lessonId
     * @return
     */
    public GradeChartsDTO<KnowledgePointDTO,Double> getAllKnowledgeGradeByLessonId(Integer lessonId,String studentId) {
        List<KnowledgePointDTO> label = new ArrayList<>();
        List<Double> pointGet = new ArrayList<>();
        GradeChartsDTO<KnowledgePointDTO, Double> result = new GradeChartsDTO<>(label, pointGet);
        List<Exam> exams = examMapper.selectList(new QueryWrapper<Exam>().eq("lesson_id", lessonId)
                .eq("status", ExamStatus.MARKED.getValue()));
        if(exams.size()==0)
            throw new LogicException("400","该班级无批阅完成的考试");
        exams.forEach(exam -> {
            List<ExamQuestion> examQuestions = examQuestionMapper.selectList(new QueryWrapper<ExamQuestion>().
                    in("exam_id", exam.getId()).eq("changed", false));
            examQuestions.forEach(
                    //处理label的返回值
                    examQuestion -> {
                        if (examQuestion.getChanged())
                            examQuestion.setQuestion(questionCopyMapper.selectQuestionCopyById(examQuestion.getQuestionId()));
                        else
                            examQuestion.setQuestion(questionMapper.selectById(examQuestion.getQuestionId()));
                        generateLabel(examQuestion, label,studentId,pointGet);
                    }
            );
        });
        return result;
    }

    private Double generatePointGet(ExamQuestion examQuestion, String studentId) {
        Answer answer=answerMapper.selectOne(new QueryWrapper<Answer>().eq("answer_sheet_id",
                answerSheetMapper.selectOne(new QueryWrapper<AnswerSheet>().eq("student_id",studentId)
                        .eq("exam_id",examQuestion.getExamId())).getId()).
                eq("question_id",examQuestion.getQuestionId()));
        return answer.getPointGet();

    }

}
