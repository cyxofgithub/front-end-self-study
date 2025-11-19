package com.exam.domain.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamingDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionDTO {
        private Integer no;
        private Integer number;
        private String type;
        private String stem;
        private Double totalScore;
        private String examineAnswer;

        private String answer = "";
        private Double getScore = 0.0;
    }

    private String typeName;
    private int count;
    private List<QuestionDTO> questionList;
}
