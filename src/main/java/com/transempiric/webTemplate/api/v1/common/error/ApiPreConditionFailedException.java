package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * {@code 412 Precondition failed}.
 */
@ResponseStatus(HttpStatus.PRECONDITION_FAILED)
public class ApiPreConditionFailedException extends ApiException {
    @Override
    public HttpStatus getDefaultStatus() {
        return HttpStatus.PRECONDITION_FAILED;
    }
}