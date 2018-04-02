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

import com.transempiric.transView.utils.JsonMessageProcessorUtil;
import com.transempiric.webTemplate.api.v1.common.response.ApiJsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TransAuthAccessDeniedHandler extends AccessDeniedHandlerImpl {
    private final ApiJsonResponse<Object> apiJSONResponse;

    public TransAuthAccessDeniedHandler(ApiJsonResponse<Object> apiJSONResponse) {
        this.apiJSONResponse = apiJSONResponse;
        this.apiJSONResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
    }

    @Override
    public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException exception) throws IOException, ServletException {
        try {
            JsonMessageProcessorUtil.getInstance().handle(this.apiJSONResponse, HttpStatus.UNAUTHORIZED, req, res);
        } catch (Exception e) {
            throw new ServletException("CustomAccessDeniedHandler Error.", e);
        }
    }
}