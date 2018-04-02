package com.transempiric.webTemplate.api.v1.common.response;

import java.io.Serializable;

public class ApiMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private String value;

    public ApiMessage() {
    }

    public ApiMessage(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
