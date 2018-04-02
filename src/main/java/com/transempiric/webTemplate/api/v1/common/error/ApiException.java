package com.transempiric.webTemplate.api.v1.common.error;


import com.transempiric.webTemplate.api.v1.common.response.ApiError;
import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Base ApiException
 * All ApiExceptions extend this class.
 * Helps maintain consistent structure of client response.
 */
public class ApiException extends RuntimeException implements Serializable {
    private static final long serialVersionUID = 1L;

    protected ApiJsonResponse<Object> response;

    public ApiException() {
        super();
        this.populateDefault();
    }

    public ApiException(String message) {
        super(message);
        this.populateDefault();
    }

    public ApiException(Throwable cause) {
        super(cause);
        this.populateDefault();
    }

    public ApiException(String message, Throwable cause) {
        super(message, cause);
        this.populateDefault();
    }

    public ApiJsonResponse<Object> getResponse() {
        return response;
    }

    public ApiException bldResponse(ApiJsonResponse<Object> response) {
        this.response = response;
        return this;
    }

    public HttpStatus getDefaultStatus() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private void populateDefault() {
        this.response = new ApiJsonResponse<>()
                .status(getDefaultStatus().value())
                .displayMessage(this.getMessage() != null ? this.getMessage() : getDefaultStatus().getReasonPhrase())
                .errors(new ArrayList<ApiError>());
    }

    public ApiException addError(ApiError apiError) {
        this.response.getErrors().add(apiError);
        return this;
    }
}