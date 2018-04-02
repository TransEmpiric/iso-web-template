package com.transempiric.webTemplate.api.v1.common.response;

import com.transempiric.webTemplate.api.v1.common.enums.ApiErrorType;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ApiJsonResponse<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private T data;
    private Integer status = 200;
    private String displayMessage;
    private List<ApiError> errors = new ArrayList<>();
    private String timestamp;

    public ApiJsonResponse() {
        this.timestamp = createTimeStamp();
    }

    public ApiJsonResponse(T data, Integer status) {
        this.timestamp = createTimeStamp();
        this.data = data;
        this.status = status;
    }

    public ApiJsonResponse(String displayMessage) {
        this.timestamp = createTimeStamp();
        this.displayMessage = displayMessage;
    }

    public ApiJsonResponse(T data, String displayMessage) {
        this.timestamp = createTimeStamp();
        this.displayMessage = displayMessage;
    }

    public ApiJsonResponse(String displayMessage, List<ApiError> errors) {
        this.timestamp = createTimeStamp();
        this.errors = errors;
        this.displayMessage = displayMessage;
    }

    public ApiJsonResponse(Integer status, String displayMessage) {
        this.timestamp = createTimeStamp();
        this.status = status;
        this.errors = null;
        this.displayMessage = displayMessage;
    }

    public ApiJsonResponse(T data, Integer status, String displayMessage) {
        this.timestamp = createTimeStamp();
        this.data = data;
        this.status = status;
        this.errors = null;
        this.displayMessage = displayMessage;
    }

    public ApiJsonResponse(List<ObjectError> bindErrors, String displayMessage) {
        this.timestamp = createTimeStamp();
        this.displayMessage = displayMessage;
        this.errors = new ArrayList<ApiError>();
        for (ObjectError be : bindErrors) {
            if (be instanceof FieldError) {
                this.errors.add(new ApiError(ApiErrorType.BIND_FIELD, ((FieldError) be).getField(), be.getDefaultMessage()));
            } else {
                this.errors.add(new ApiError(ApiErrorType.BIND_OBJECT, be.getObjectName(), be.getDefaultMessage()));
            }
        }
    }

    public ApiJsonResponse(T data, Integer status, String displayMessage, List<ApiError> errors) {
        this.timestamp = createTimeStamp();
        this.data = data;
        this.status = status;
        this.displayMessage = displayMessage;
        this.errors = errors;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ApiJsonResponse<T> data(T data) {
        this.data = data;
        return this;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public ApiJsonResponse<T> status(Integer status) {
        this.status = status;
        return this;
    }

    public String getDisplayMessage() {
        return displayMessage;
    }

    public void setDisplayMessage(String message) {
        this.displayMessage = message;
    }

    public ApiJsonResponse<T> displayMessage(String message) {
        this.displayMessage = message;
        return this;
    }

    public List<ApiError> getErrors() {
        return errors;
    }

    public void setErrors(List<ApiError> errors) {
        this.errors = errors;
    }

    public ApiJsonResponse<T> errors(List<ApiError> errors) {
        this.errors = errors;
        return this;
    }

    public ApiJsonResponse<T> addError(ApiError error) {
        this.errors.add(error);
        return this;
    }

    public String getTimestamp() {
        return timestamp;
    }

    private ApiJsonResponse<T> timeStamp() {
        Date date = new Date();
        this.timestamp = createTimeStamp();
        return this;
    }

    private String createTimeStamp() {
        Date date = new Date();
        return new Timestamp(date.getTime()).toString();
    }
}
