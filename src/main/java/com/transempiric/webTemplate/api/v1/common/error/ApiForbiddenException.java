package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * {@code 403 Forbidden}.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class ApiForbiddenException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.FORBIDDEN;
    }
}