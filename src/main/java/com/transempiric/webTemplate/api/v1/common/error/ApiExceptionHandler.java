package com.transempiric.webTemplate.api.v1.common.error;

import com.transempiric.transAuth.error.TransAuthBaseException;
import com.transempiric.webTemplate.api.v1.common.enums.ApiErrorType;
import com.transempiric.webTemplate.api.v1.common.response.ApiError;
import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.beans.ConversionNotSupportedException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Set;

@ControllerAdvice(annotations = RestController.class)
@RestController
class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    public ApiExceptionHandler() {
        super();
    }

    /**
     * **********************************************
     * ************ TransAuth Exceptions ************
     * TransAuthMalformedException -- 401 ************
     * TransAuthMissingException   -- 401 ************
     * TransAuthUserNotFoundException   -- 401 ************
     * **********************************************
     */

    @ExceptionHandler(TransAuthBaseException.class)
    public ResponseEntity<Object> handleTansAuthException(TransAuthBaseException ex, WebRequest request) {
        // TODO: Test generic object: status
        return handleExceptionInternal(ex, ex.getPayload(), new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    /**
     * **********************************************
     * ************* Internal API Exceptions ********
     * ApiBadRequestException          -- 400 *******
     * ApiUnauthorizedException        -- 401 *******
     * ApiForbiddenException           -- 403 *******
     * ApiNotFoundException            -- 404 *******
     * ApiPreConditionFailedException  -- 412 *******
     * ApiInternalServerErrorException -- 500 *******
     * **********************************************
     */

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Object> handleApiException(ApiException ex, WebRequest request) {
        return handleExceptionInternal(ex, ex.getResponse(), new HttpHeaders(), HttpStatus.valueOf(ex.getResponse().getStatus()), request);
    }

    /**
     * **********************************************
     * ************* Spring Exceptions **************
     * **********************************************
     */

    // 401
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFoundException(final UsernameNotFoundException ex, final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage())
                .addError(
                        new ApiError(ex.getMessage()).errorType(ApiErrorType.AUTH)
                );
        resp.setStatus(HttpStatus.UNAUTHORIZED.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    // 401
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleUBadCredentialsException(final BadCredentialsException ex, final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage())
                .addError(
                        new ApiError(ex.getMessage()).errorType(ApiErrorType.AUTH)
                );
        resp.setStatus(HttpStatus.UNAUTHORIZED.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    // 401
    public @ExceptionHandler(InsufficientAuthenticationException.class)
    ResponseEntity<Object> handleInsufficientAuthenticationException(final InsufficientAuthenticationException ex, final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage())
                .addError(
                        new ApiError(ex.getMessage()).errorType(ApiErrorType.AUTH)
                );
        resp.setStatus(HttpStatus.UNAUTHORIZED.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }

    // 403
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedExceptionException(final AccessDeniedException ex, final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage())
                .addError(
                        new ApiError(ex.getMessage()).errorType(ApiErrorType.AUTH)
                );
        resp.setStatus(HttpStatus.FORBIDDEN.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.FORBIDDEN, request);
    }
    
    // 503
    @Override
    protected ResponseEntity<Object> handleAsyncRequestTimeoutException(@NonNull AsyncRequestTimeoutException ex, @Nullable HttpHeaders headers, @Nullable HttpStatus status, @NonNull WebRequest webRequest) {
        if (webRequest instanceof ServletWebRequest) {
            ServletWebRequest servletWebRequest = (ServletWebRequest) webRequest;
            HttpServletRequest request = servletWebRequest.getRequest();
            HttpServletResponse response = servletWebRequest.getResponse();

            if (response.isCommitted()) {
                if (logger.isErrorEnabled()) {
                    logger.error("Async timeout for " + request.getMethod() + " [" + request.getRequestURI() + "]");
                }
                return null;
            }
        }

        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.SERVICE_UNAVAILABLE, webRequest);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleHttpMessageNotReadable(@NonNull HttpMessageNotReadableException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 404
    @Override
    @Nullable
    protected ResponseEntity<Object> handleNoHandlerFoundException(@NonNull NoHandlerFoundException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.NOT_FOUND.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    // 404
    @Override
    @Nullable
    protected ResponseEntity<Object> handleMissingServletRequestPart(@NonNull MissingServletRequestPartException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleServletRequestBindingException(@NonNull ServletRequestBindingException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleMissingServletRequestParameter(@NonNull MissingServletRequestParameterException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 500
    @Override
    @Nullable
    protected ResponseEntity<Object> handleMissingPathVariable(@NonNull MissingPathVariableException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // 406
    @Override
    @Nullable
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(@NonNull HttpMediaTypeNotAcceptableException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.NOT_ACCEPTABLE, request);
    }

    // 415
    @Override
    @Nullable
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, @NonNull final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        List<MediaType> mediaTypes = ex.getSupportedMediaTypes();
        if (!CollectionUtils.isEmpty(mediaTypes)) {
            headers.setAccept(mediaTypes);
        }
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
        return handleExceptionInternal(ex, resp, headers, HttpStatus.UNSUPPORTED_MEDIA_TYPE, request);
    }

    // 405
    @Override
    @Nullable
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, @NonNull final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        pageNotFoundLogger.warn(ex.getMessage());

        Set<HttpMethod> supportedMethods = ex.getSupportedHttpMethods();
        if (!CollectionUtils.isEmpty(supportedMethods)) {
            headers.setAllow(supportedMethods);
        }

        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.METHOD_NOT_ALLOWED.value());
        return handleExceptionInternal(ex, resp, headers, HttpStatus.METHOD_NOT_ALLOWED, request);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleTypeMismatch(@NonNull TypeMismatchException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 500
    @Override
    @Nullable
    protected ResponseEntity<Object> handleConversionNotSupported(@NonNull ConversionNotSupportedException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // 500
    @Override
    @Nullable
    protected ResponseEntity<Object> handleHttpMessageNotWritable(@NonNull HttpMessageNotWritableException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleBindException(@NonNull final BindException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        final BindingResult result = ex.getBindingResult();
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(result.getAllErrors(), "Invalid binding for " + result.getObjectName());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    // 400
    @Override
    @Nullable
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull final MethodArgumentNotValidException ex, @Nullable final HttpHeaders headers, @NonNull final HttpStatus status, @NonNull final WebRequest request) {
        final BindingResult result = ex.getBindingResult();
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(result.getAllErrors(), "Invalid binding for " + result.getObjectName());
        resp.setStatus(HttpStatus.BAD_REQUEST.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    /*
     ***********************************************
     ******** Catch All Unknown Exceptions *********
     ***********************************************
     */

    // 500
    @ExceptionHandler({Exception.class})
    public ResponseEntity<Object> handleInternal(final RuntimeException ex, final WebRequest request) {
        ApiJsonResponse<Object> resp = new ApiJsonResponse<>(ex.getMessage());
        resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return handleExceptionInternal(ex, resp, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    /*
     ***********************************************
     ******** Internal Exceptions\ Handler *****
     ***********************************************
     */

    @Override
    @Nullable
    protected ResponseEntity<Object> handleExceptionInternal(@NonNull Exception ex, @Nullable Object body, HttpHeaders headers, HttpStatus status, @NonNull WebRequest request) {
        logger.warn("Status Code: " + status.value() + " (" + status.getReasonPhrase() + ")"
                        + "\nRequest Description: " + request.getDescription(true),
                ex);

        //if (HttpStatus.INTERNAL_SERVER_ERROR.equals(status)) {
           // request.setAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE, ex, WebRequest.SCOPE_REQUEST);
        //}

        return new ResponseEntity<>(body, headers, status);
    }
}