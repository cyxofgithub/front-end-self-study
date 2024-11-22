package com.exam.domain.enums;

public enum AnswerSheetStatus {
    UNANSWERED("未答题"),
    UNMARKED("未批阅"),
    ANSWERING("答题中"),
    MARKED("已批阅"),
    CANCELLED("违规");
    private String value;

    AnswerSheetStatus(String value){
        this.value=value;
    }
    public String getValue() {
        return value;
    }
}
