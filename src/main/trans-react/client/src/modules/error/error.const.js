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

/* @flow */
export const ERROR_UNKNOWN = "ERROR_UNKNOWN";
export const ERROR_INTERNAL = "ERROR_INTERNAL";
export const ERROR_NETWORK = "ERROR_NETWORK";
export const ERROR_HTTP = "ERROR_HTTP";
export const ERROR_REST = "ERROR_REST";

export const ERROR_AUTH_NO_LOCAL_STORAGE_USER = "ERROR_AUTH_NO_LOCAL_STORAGE_USER";
export const ERROR_AUTH_ALL_TOKENS_EXPIRED = "ERROR_AUTH_ALL_TOKENS_EXPIRED";
export const ERROR_AUTH_INVALID_AUTH_TOKEN = "ERROR_AUTH_INVALID_AUTH_TOKEN";
export const ERROR_AUTH_INVALID_REFRESH_TOKEN = "ERROR_AUTH_INVALID_REFRESH_TOKEN";

export const ADD_ERROR_ACTION = "ADD_ERROR_ACTION";
export const UNLOCK_ERROR_ACTION = "UNLOCK_ERROR_ACTION";
export const DISMISS_ALL_ERROR_ACTION = "DISMISS_ALL_ERROR_ACTION";
export const DISMISS_ERROR_ACTION = "DISMISS_ERROR_ACTION";