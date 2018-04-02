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

package com.transempiric.transView.view;

import com.transempiric.transView.utils.FunctionsUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

public abstract class TransViewAbstractState implements TransViewState {

    /**
     * Populates standard parts of the shared client/server model into the Spring {@link Model}.
     * Values prefixed with "__" will be made available to the JavaScript
     * render function only. All other values will be passed in the client's state object.
     */
    public void populateModel(Model model, HttpServletRequest request) {
        model.addAttribute("__requestPath", getRequestPath(request));
        this.getState(model, request);
    }

    /**
     * Returns the request string, including the query fragment, so that it can be made available
     * during server-side react-router rendering.
     */
    private String getRequestPath(HttpServletRequest request) {
        String queryString = request.getQueryString();
        return request.getRequestURI() + (queryString == null ? "" : "?" + queryString);
    }

    /**
     * Return a list of the current user's optionalAuthorities. If they are not authenticated then they will
     * have "ROLE_ANONYMOUS".
     */
    protected Optional<List<String>> getAuthorities(HttpServletRequest request) {
        return getAuthentication(request)
                .map(a -> FunctionsUtil.map(a.getAuthorities(), GrantedAuthority::getAuthority));
    }

    /**
     * Getting the current authentication object ought to be easy, by getting a context with
     * {@link SecurityContextHolder#getContext()}, then calling {@link SecurityContext#getAuthentication()}.
     * However there are circumstances where that doesn't work reliably, such as when handling
     * exceptions. This method makes several attempts to get an {@link Authentication} instance.
     */
    private Optional<Authentication> getAuthentication(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            RequestAttributes requestAttributes = new ServletRequestAttributes(request);
            SecurityContext securityContext = (SecurityContext) requestAttributes.getAttribute("SPRING_SECURITY_CONTEXT", RequestAttributes.SCOPE_SESSION);
            if (securityContext == null) {
                securityContext = (SecurityContext) requestAttributes.getAttribute("SPRING_SECURITY_CONTEXT", RequestAttributes.SCOPE_REQUEST);
            }
            if (securityContext != null) {
                authentication = securityContext.getAuthentication();
            }
        }

        return Optional.ofNullable(authentication);
    }
}
