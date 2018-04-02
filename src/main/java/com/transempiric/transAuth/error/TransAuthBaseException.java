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

package com.transempiric.transAuth.error;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Base TransAuthBaseException
 * All TransAuthExceptions extend this class.
 * Helps maintain consistent structure of client response.
 */
public class TransAuthBaseException extends RuntimeException implements TransAuthException, Serializable {
    private static final long serialVersionUID = 1L;

    private static final String DEFAULT_MESSAGE = "";
    private static final int DEFAULT_STATUS = 401;

    protected TransAuthJsonResponse<Object> payload;

    public TransAuthBaseException() {
        super();
        this.populateDefault();
    }

    public TransAuthBaseException(String message) {
        super(message);
        this.populateDefault();
    }

    public TransAuthBaseException(Throwable cause) {
        super(cause);
        this.populateDefault();
    }

    public TransAuthBaseException(String message, Throwable cause) {
        super(message, cause);
        this.populateDefault();
    }

    public TransAuthBaseException(TransAuthJsonResponse<Object> payload) {
        super(payload.getDisplayMessage());
        this.payload = payload;
    }

    public TransAuthJsonResponse<Object> getPayload() {
        return payload;
    }

    public TransAuthBaseException setPayload(TransAuthJsonResponse<Object> payload) {
        this.payload = payload;
        return this;
    }

    public TransAuthBaseException addError(String err) {
        this.payload.getErrors().add(err);
        return this;
    }

    @Override
    public Integer getDefaultStatus() {
        return DEFAULT_STATUS;
    }

    @Override
    public String getDefaultMessage() {
        return DEFAULT_MESSAGE;
    }

    @Override
    public void populateDefault() {
        String errMsg = this.getMessage() != null ? this.getMessage() : DEFAULT_MESSAGE;
        List<String> errList = new ArrayList<>();
        errList.add(errMsg);
        this.payload = new TransAuthJsonResponse<>()
                .setStatus(DEFAULT_STATUS)
                .setDisplayMessage(errMsg)
                .setErrors(errList);
    }
}