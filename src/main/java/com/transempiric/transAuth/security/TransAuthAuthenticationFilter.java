/*
 * MIT License
 *
 * Copyright (c) 2018 Transempiric
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package com.transempiric.transAuth.security;

import com.transempiric.transAuth.enums.TransAuthTokenType;
import com.transempiric.transAuth.error.*;
import com.transempiric.transAuth.error.TransAuthMalformedException;
import com.transempiric.transAuth.error.TransAuthInvalidException;
import com.transempiric.transAuth.token.TransAuthAuthenticationToken;
import com.transempiric.transAuth.service.TransAuthTokenService;
import com.transempiric.webTemplate.api.v1.common.enums.ApiErrorType;
import com.transempiric.webTemplate.api.v1.common.response.ApiError;
import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TransAuthAuthenticationFilter extends OncePerRequestFilter {

    private final Log logger = LogFactory.getLog(this.getClass());

    private TransAuthTokenService transAuthTokenService;

    private UserDetailsService userDetailsService;

    public TransAuthAuthenticationFilter(TransAuthTokenService transAuthTokenService, UserDetailsService userDetailsService) {
        this.transAuthTokenService = transAuthTokenService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {

        String username;
        String authToken = transAuthTokenService.getToken(request);
        try {
            if (authToken == null) throw new TransAuthMissingException();

            // get username from token
            username = transAuthTokenService.getUsernameFromToken(authToken, TransAuthTokenType.AUTH);
            if (username == null) throw new TransAuthMalformedException("Username not found.");

            // get user
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (!transAuthTokenService.validateToken(authToken, TransAuthTokenType.AUTH, userDetails))
                throw new TransAuthMalformedException("Invalid token.");

            // create authentication
            SecurityContextHolder.getContext().setAuthentication(new TransAuthAuthenticationToken(authToken, username, userDetails.getAuthorities()));
        } catch (Exception e) {
            logger.error("JWT Authentication Error", e);

            List<ApiError> apiErrors = new ArrayList<>();
            ApiJsonResponse<Object> apiJsonResponse = null;

            if (e instanceof TransAuthExpiredException) {
                apiErrors.add(new ApiError(e.getMessage()).errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Token expired.", apiErrors);
            }

            if (e instanceof TransAuthMissingException) {
                apiErrors.add(new ApiError(e.getMessage()).errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Token missing.", apiErrors);
            }

            if (e instanceof TransAuthMalformedException) {
                apiErrors.add(new ApiError(e.getMessage()).errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Invalid token format.", apiErrors);
            }

            if (e instanceof TransAuthInvalidException) {
                apiErrors.add(new ApiError(e.getMessage()).errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Invalid token.", apiErrors);
            }

            if (e instanceof ExpiredJwtException) {
                // TODO: Maybe should not indicate info here
                apiErrors.add(new ApiError(e.getMessage()).errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Token expired.", apiErrors);
            }

            if (e instanceof MalformedJwtException) {
                apiErrors.add(new ApiError("Invalid token format.").errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Invalid token format.", apiErrors);
            }

            if (apiJsonResponse == null) {
                apiErrors.add(new ApiError("Invalid token.").errorType(ApiErrorType.AUTH));
                apiJsonResponse = new ApiJsonResponse<>("Token authentication failure. Invalid token.", apiErrors);
            }

            final AccessDeniedHandler accessDeniedHandler = new TransAuthAccessDeniedHandler(apiJsonResponse);
            final AccessDeniedException ade = new AccessDeniedException(e.getMessage());

            accessDeniedHandler.handle(request, response, ade);
            return;
        }

        chain.doFilter(request, response);
    }

}