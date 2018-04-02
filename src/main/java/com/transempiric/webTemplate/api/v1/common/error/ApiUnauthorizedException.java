package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * {@code 401 Unauthorized}.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class ApiUnauthorizedException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}