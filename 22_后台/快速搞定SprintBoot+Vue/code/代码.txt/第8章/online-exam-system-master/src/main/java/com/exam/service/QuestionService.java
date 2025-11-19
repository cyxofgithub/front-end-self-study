package com.exam.service;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.exam.dao.*;
import com.exam.domain.*;
import com.exam.domain.enums.QuestionType;
import com.exam.handler.StpHandler;
import com.exam.utils.LogicException;
import com.exam.utils.ResultBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private TeacherMapper teacherMapper;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private KnowledgePointMapper knowledgePointMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private QuestionCopyMapper questionCopyMapper;

    /**
     * 上传科目
     * @param subjectName 科目名称
     * @return 上传后的科目信息
     */
    public Subject postSubject(String subjectName) {

        // 依次处理信息
        if (subjectName.equals("")) {
            throw new LogicException("400", "科目信息不全！");
        }

        Subject subject = new Subject();
        subject.setName(subjectName);
        subjectMapper.insert(subject);

        return subject;
    }

    /**
     * 上传知识点
     * @param knowledgePointName 知识点名称
     * @param subjectId 知识点所属科目id
     * @return 知识点信息
     */
    public KnowledgePoint postKnowledgePoint(String knowledgePointName, int subjectId) {

        // 依次处理信息
        if (knowledgePointName.equals("")) {
            throw new LogicException("400", "知识点信息不全！");
        }

        if (subjectMapper.selectById(subjectId) == null) {
            throw new LogicException("400", "请重新选择科目！");
        }

        KnowledgePoint knowledgePoint = new KnowledgePoint();
        knowledgePoint.setName(knowledgePointName);
        knowledgePoint.setSubjectId(subjectId);
        knowledgePointMapper.insert(knowledgePoint);

        return knowledgePoint;
    }

    /**
     * 上传题目至题库
     * @param isCopy 是否是副本
     * @param question 题目信息
     * @return 上传后的题目信息
     */
    public Question postQuestion(boolean isCopy, Question question) {
        // 依次处理信息
        if (question.getStem().equals("") || question.getAnswer().equals("")) {
            throw new LogicException("400", "题目信息不全！");
        }
        if (knowledgePointMapper.selectById(question.getKnowledgePointId()) == null) {
            throw new LogicException("400", "请重新选择知识点！");
        }

        question.setTeacherId(StpHandler.getId());
        if (teacherMapper.selectById(question.getTeacherId()) == null) {
            throw new LogicException("400", "请重新登录！");
        }
        question.setCreateTime(new Date());
        question.setUrl("");

        if (isCopy) {
            questionCopyMapper.insertQuestionCopy(question);
        } else {
            questionMapper.insert(question);
        }

        return question;
    }

    /**
     * 根据id获取题目
     * @param id 题目id
     * @return 包括题目知识点和教师的题目信息
     */
    public Question getQuestionById(int id) {

        Question question = questionMapper.selectById(id);
        if (question == null) {
            throw new LogicException("400", "未找到题目");
        }
        KnowledgePoint knowledgePoint = knowledgePointMapper.selectById(question.getKnowledgePointId());
        Teacher teacher = teacherMapper.selectById(question.getTeacherId());

        if (knowledgePoint == null) {
            throw new LogicException("400", "无法获取该题目知识点！");
        } else {
            question.setKnowledgePoint(knowledgePoint);
        }

        if (teacher == null) {
            throw new LogicException("400", "无法获取该题目上传教师！");
        } else {
            question.setTeacher(teacher);
        }

        return question;
    }


    /**
     * 查找全部题目（分页）
     * @param index 页码
     * @param pageSize 每页条目数
     * @return 题目列表
     */
    public Page<Question> getQuestionList(int index, int pageSize) {
        Page<Question> questions = questionMapper.selectPage(new Page(index, pageSize), Wrappers.<Question>query().lambda()
                .orderByDesc(Question::getCreateTime));
        return questions;
    }

    /**
     * 查找该老师的题目（分页）
     * @param index 页码
     * @param pageSize 每页条目数
     * @param teacherId 教师id
     * @return 题目列表
     */
    public Page<Question> getQuestionListByTeacher(int index, int pageSize, String teacherId) {

        if (teacherMapper.selectById(teacherId) == null) {
            throw new LogicException("400", "未找到教师！");
        }

        Page<Question> questions = questionMapper.selectPage(new Page(index, pageSize), Wrappers.<Question>query().lambda()
                .eq(Question::getTeacherId, teacherId)
                .orderByDesc(Question::getCreateTime));

        List<Question> temp = questions.getRecords();
        temp.forEach(question -> {
            KnowledgePoint knowledgePoint = knowledgePointMapper.selectById(question.getKnowledgePointId());
            if (knowledgePoint == null) {
                throw new LogicException("400", "无法获取该题目知识点！");
            } else {
                question.setKnowledgePoint(knowledgePoint);
            }
        });

        questions.setRecords(temp);

        return questions;
    }

    /**
     * 根据科目id查找题目列表
     * @param index 页码
     * @param pageSize 每页条目数
     * @param subjectId 科目id
     * @return 题目列表
     */
    public Page<Question> getQuestionListBySubject(int index, int pageSize, int subjectId) {

        if (subjectMapper.selectById(subjectId) == null) {
            throw new LogicException("400", "无法找到对应科目信息！");
        }

        Page<Question> questionList = questionMapper.selectPage(new Page(index, pageSize), Wrappers.<Question>query().lambda()
                .inSql(Question::getKnowledgePointId, "select id from knowledge_point where subject_id = " + subjectId)
                .orderByDesc(Question::getCreateTime));
        return questionList;
    }

    /**
     * 根据知识点id查找题目列表
     * @param index 页码
     * @param pageSize 每页条目数
     * @param knowledgePointId 知识点id
     * @return 题目列表
     */
    public Page<Question> getQuestionListByKnowledgePoint(int index, int pageSize, int knowledgePointId) {

        if (knowledgePointMapper.selectById(knowledgePointId) == null) {
            throw new LogicException("400", "无法找到对应知识点信息！");
        }

        Page<Question> questionList = questionMapper.selectPage(new Page(index, pageSize), Wrappers.<Question>query().lambda()
                .eq(Question::getKnowledgePointId, knowledgePointId)
                .orderByDesc(Question::getCreateTime));
        return questionList;
    }

    /**
     * 组卷部分获取题目
     * @param subjectId 科目id
     * @return 题目列表
     */
    public List<Question> getByExamPaper(int subjectId, String type, String teacherId) {

        if (subjectMapper.selectById(subjectId) == null) {
            throw new LogicException("400", "无法找到对应科目信息！");
        }

        List<Question> questionList = questionMapper.selectList(Wrappers.<Question>query().lambda()
                .eq(Question::getTeacherId, teacherId)
                .eq(Question::getType, type)
                .inSql(Question::getKnowledgePointId, "select id from knowledge_point where subject_id = " + subjectId)
                .orderByDesc(Question::getCreateTime));

        questionList.forEach(question -> {
            question.setKnowledgePoint(knowledgePointMapper.selectById(question.getKnowledgePointId()));
        });

        return questionList;
    }

    /**
     * 查找科目列表
     * @return 科目列表
     */
    public List<Subject> getSubjectList() {

        List<Subject> subjectList = subjectMapper.selectList(null);

        return subjectList;
    }

    public List<KnowledgePoint> getKnowledgePointListBySubject(int subjectId) {

        if (subjectMapper.selectById(subjectId) == null) {
            throw new LogicException("500", "无法找到对应科目！");
        }

        List<KnowledgePoint> knowledgePointList = knowledgePointMapper.selectList(Wrappers.<KnowledgePoint>query().lambda()
                .eq(KnowledgePoint::getSubjectId, subjectId));

        return knowledgePointList;
    }

    public List<Subject> getKnowledgePointList() {

        List<Subject> subjectList = subjectMapper.selectList(null);
        subjectList.forEach(subject -> {
            subject.setKnowledgePointList(knowledgePointMapper.selectList(Wrappers.<KnowledgePoint>query().lambda()
                    .eq(KnowledgePoint::getSubjectId, subject.getId())));
        });

        return subjectList;
    }


}
