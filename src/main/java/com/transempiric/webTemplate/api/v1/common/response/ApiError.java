package com.transempiric.webTemplate.api.v1.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.transempiric.webTemplate.api.v1.common.enums.ApiErrorType;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError implements Serializable {

    private static final long serialVersionUID = 1L;

    private ApiErrorType errorType;
    private String name;
    private String message;

    public ApiError() {
    }

    public ApiError(String message) {
        this.errorType = ApiErrorType.OTHER;
        this.message = message;
    }

    public ApiError(ApiErrorType errorType, String name, String message) {
        this.errorType = errorType;
        this.name = name;
        this.message = message;
    }

    public ApiErrorType getErrorType() {
        return errorType;
    }

    public ApiError errorType(ApiErrorType errorType) {
        this.errorType = errorType;
        return this;
    }

    public String getName() {
        return name;
    }

    public ApiError name(String name) {
        this.name = name;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ApiError message(String message) {
        this.message = message;
        return this;
    }
}
