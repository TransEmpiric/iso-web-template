package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * {@code 204 No Content}.
 */
@ResponseStatus(HttpStatus.NO_CONTENT)
public class ApiNoConentException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.NO_CONTENT;
    }
}