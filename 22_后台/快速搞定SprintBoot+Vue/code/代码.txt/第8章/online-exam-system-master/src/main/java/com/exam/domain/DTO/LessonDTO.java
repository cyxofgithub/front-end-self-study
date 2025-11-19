package com.exam.domain.DTO;

import com.exam.domain.Lesson;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//班级管理返回的班级
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Lesson lesson;//班级
    private Long notStartedCount;//未开始的考试数
    private Long startedCount;//正在进行的考试数
    private Long finishedCount;//未批阅的考试数
    private Long markedCount;//已经出分的考试数
}
