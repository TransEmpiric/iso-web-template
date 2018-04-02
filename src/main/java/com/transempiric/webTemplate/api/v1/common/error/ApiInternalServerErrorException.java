package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serializable;

/**
 * {@code 500 Internal Server Error}.
 */
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ApiInternalServerErrorException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}