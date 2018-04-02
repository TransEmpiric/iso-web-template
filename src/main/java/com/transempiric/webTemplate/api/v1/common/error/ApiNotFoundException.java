package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * {@code 404 Not Found}.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ApiNotFoundException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.NOT_FOUND;
    }
}