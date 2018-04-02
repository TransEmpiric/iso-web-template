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
import java.time.Clock;
import java.time.Instant;
import java.util.List;

public class TransAuthJsonResponse<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private static final int DEFAULT_STATUS = 200;

    private T data;
    private Integer status;
    private String displayMessage;
    private List<String> errors;
    private String timestamp;

    public TransAuthJsonResponse() {
        this.status = DEFAULT_STATUS;
        this.timestamp = Instant.now(Clock.systemUTC()).toString();
    }

    public TransAuthJsonResponse(String displayMessage) {
        this();
        this.displayMessage = displayMessage;
    }

    public T getData() {
        return data;
    }

    public TransAuthJsonResponse<T> setData(T data) {
        this.data = data;
        return this;
    }

    public Integer getStatus() {
        return this.status;
    }

    public TransAuthJsonResponse<T> setStatus(Integer status) {
        this.status = status;
        return this;
    }

    public String getDisplayMessage() {
        return this.displayMessage;
    }

    public TransAuthJsonResponse<T> setDisplayMessage(String message) {
        this.displayMessage = message;
        return this;
    }

    public List<String> getErrors() {
        return this.errors;
    }

    public TransAuthJsonResponse<T> setErrors(List<String> errors) {
        this.errors = errors;
        return this;
    }

    public String getTimestamp() {
        return this.timestamp;
    }

    public TransAuthJsonResponse<T> setTimeStamp() {
        this.timestamp = Instant.now(Clock.systemUTC()).toString();
        return this;
    }
}