package com.exam.domain.enums;

public enum ExamStatus {
    NOTSTARTED("时间未到"),
    STARTED("正在考试"),
    FINISHED("已结束"),
    MARKED("已批阅");
    private String value;

    ExamStatus(String value){
        this.value=value;
    }
    public String getValue() {
        return value;
    }
}
