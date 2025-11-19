package com.exam.domain.DTO;

import com.alibaba.fastjson.JSON;
import com.exam.domain.Exam;
import com.exam.domain.Question;
import com.exam.handler.StpHandler;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamPaperDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AnswerDTO {
        private int no;
        private String answer;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Stem {
        private String itemLabel;
        private List<AnswerDTO> answerArray;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubjectDTO {
        private int id;
        private String label;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDTO {
        private Integer id;
        private Stem stem;
        private String correctAnswer;
        private Double totalScore;
        private Integer knowledgePointId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionListDTO {
        private String subjectName;
        private Integer itemCount;
        private List<QuestionDTO> itemList;
    }

    // 前端属性
    private Exam exam;
    private List<SubjectDTO> subjectDTOList;
    private List<QuestionListDTO> questionListDTOList;

    public ExamPaperResponseDTO handleInfo() {

        List<Question[]> questionList = new ArrayList<>();
        List<Double[]> scoreList = new ArrayList<>();
        List<Boolean[]> isCopyList = new ArrayList<>();
        List<String> bigTypeList = new ArrayList<>();

        // 大题类型
        List<String> types = new ArrayList<>();
        subjectDTOList.forEach(item -> {
            types.add(item.getLabel());
        });

        // 处理题目
        questionListDTOList.forEach(item -> {
            // 处理大题
            int length = item.getItemList().size();

            if (types.contains(item.getSubjectName())) {
                Question[] questionTemp = new Question[length];
                Double[] scoreTemp = new Double[length];
                Boolean[] copyTemp = new Boolean[length];

                for (int i = 0; i < length; i++) {

                    // 依次处理小题属性
                    Question temp = new Question();
                    temp.setId(item.getItemList().get(i).getId());
                    temp.setStem(JSON.toJSONString(item.getItemList().get(i).getStem()));
                    temp.setAnswer(item.getItemList().get(i).getCorrectAnswer());
                    temp.setType(item.getSubjectName());
                    temp.setCreateTime(new Date());
                    temp.setUrl("");
                    temp.setKnowledgePointId(item.getItemList().get(i).getKnowledgePointId());
                    temp.setTeacherId(StpHandler.getId());

                    // 依次处理分数
                    questionTemp[i] = temp;
                    scoreTemp[i] = item.getItemList().get(i).getTotalScore();

                    // 依次处理是否是副本
                    copyTemp[i] = false;
                }

                // 将数组加入结果
                questionList.add(questionTemp);
                scoreList.add(scoreTemp);
                isCopyList.add(copyTemp);
                bigTypeList.add(item.getSubjectName());
            }

        });

        return new ExamPaperResponseDTO(questionList, scoreList, isCopyList, bigTypeList);
    }
}
