package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * {@code 400 Bad Request}.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ApiBadRequestException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}