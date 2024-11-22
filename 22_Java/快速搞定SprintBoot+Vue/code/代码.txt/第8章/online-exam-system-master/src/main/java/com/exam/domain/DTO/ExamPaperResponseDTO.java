package com.exam.domain.DTO;

import com.exam.domain.Question;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExamPaperResponseDTO {
    private List<Question[]> questionList;
    private List<Double[]> scoreList;
    private List<Boolean[]> isCopyList;
    private List<String> bigTypeList;
}
