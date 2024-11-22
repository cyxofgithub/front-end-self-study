package com.exam.domain.enums;

public enum UserStatus {
    CERTIFYING("审核中"),
    PASS("通过"),
    NOT_PASS("未通过");
    private String value;

    UserStatus(String value){
        this.value=value;
    }
    public String getValue() {
        return value;
    }
}
