package com.exam.domain.enums;

public enum QuestionType {
    SINGLE("单选题"),
    MULTIPLE("多选题"),
    CHECK("判断题"),
    FILLING("填空题"),
    SHORTANSWER("简答题");
    private String value;

    QuestionType(String value){
        this.value=value;
    }
    public String getValue() {
        return value;
    }
}
