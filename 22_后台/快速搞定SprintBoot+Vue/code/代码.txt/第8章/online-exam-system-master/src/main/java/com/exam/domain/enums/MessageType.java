package com.exam.domain.enums;

public enum MessageType {
    SCORE("成绩通知"),
    EXAM("考试通知"),
    CLASS("班级通知");
    private String value;

    MessageType(String value){
        this.value=value;
    }
    public String getValue() {
        return value;
    }
}
