package com.transempiric.webTemplate.api.v1.common.response;

public class ApiResponse {
    private String guid;
    private String message;
    private Boolean status;

    public ApiResponse(String guid, String message, Boolean status) {
        this.guid = guid;
        this.message = message;
        this.status = status;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getGuid() {
        return guid;
    }

    public void setGuid(String guid) {
        this.guid = guid;
    }
}