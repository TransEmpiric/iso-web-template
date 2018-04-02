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
import {ErrorDetailType} from "./error.detail.type";
import * as UUID from "uuid/v4";
import * as errConst from "./error.const";

export type ErrorType = {
    id: string,
    name: string,
    displayMessage?: string,
    code?: number,
    errorDetails?: ErrorDetailType[],
    timestamp?: string,
    data?: any,
    logout: boolean,
    redirect?: string
};

export function networkError(name, displayMessage, code, logout, redirect, errorDetails, data) : ErrorType {
    return {
        id: UUID(),
        name: name ? name : errConst.ERROR_UNKNOWN,
        displayMessage: displayMessage ? displayMessage : "Unknown error.",
        code: code ? code : -1,
        logout : false,
        redirect: redirect ? redirect : null,
        errorDetails: errorDetails ? errorDetails : [],
        data: data ? data : {}
    };
}

export function httpError(name, displayMessage, code, logout, redirect, errorDetails, data) : ErrorType {
    return {
        id: UUID(),
        name: name ? name : errConst.ERROR_UNKNOWN,
        displayMessage: displayMessage ? displayMessage : "Unknown error.",
        code: code ? code : -1,
        logout : false,
        redirect: redirect ? redirect : null,
        errorDetails: errorDetails ? errorDetails : [],
        data: data ? data : {}
    };
}

export function unknownError(name, displayMessage, code, logout, redirect, errorDetails, data) : ErrorType {
    return {
        id: UUID(),
        name: name ? name : errConst.ERROR_UNKNOWN,
        displayMessage: displayMessage ? displayMessage : "Unknown error.",
        code: code ? code : -1,
        logout : false,
        redirect: redirect ? redirect : null,
        errorDetails: errorDetails ? errorDetails : [],
        data: data ? data : {}
    };
}

export function internalError(name, displayMessage, code, logout, redirect, errorDetails, data) : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_INTERNAL,
        displayMessage: displayMessage ? displayMessage : "Internal error",
        code: code ? code : 500,
        logout : false,
        redirect: redirect ? redirect : null,
        errorDetails: errorDetails ? errorDetails : [],
        data: data ? data : {}
    };
}

export function genericError(errorType: ErrorType, name : string, code: number, displayMessage: string, redirect: string, logout: boolean, data: any) : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_HTTP,
        displayMessage: (errorType && errorType.displayMessage) ? errorType.displayMessage : (displayMessage) ? displayMessage : "Unknown Error",
        code: (errorType && errorType.code) ? errorType.code : (code) ? code : -1,
        errorDetails: (errorType && errorType.errorDetails) ? errorType.errorDetails : [],
        data: (errorType && errorType.data) ? errorType.data : (data) ? data : {},
        timestamp: (errorType && errorType.timestamp) ? errorType.timestamp : null,
        logout : (typeof logout !== 'undefined' && logout !== null) ? logout : false,
        redirect: redirect ? redirect : null
    };
}

export function noLocalStorageUserError() : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_AUTH_NO_LOCAL_STORAGE_USER,
        displayMessage: "No Local Storage User found error",
        code: -1,
        logout : false,
        redirect: "/signIn",
        errorDetails: [],
        data: {}
    };
}

export function invalidAuthTokenError(displayMessage) : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_AUTH_INVALID_AUTH_TOKEN,
        displayMessage: displayMessage ? displayMessage : "Invalid Auth Token",
        code: -1,
        logout : true,
        redirect: "/signIn",
        errorDetails: [],
        data: {}
    };
}

export function accessDeniedError(displayMessage) : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_AUTH_INVALID_AUTH_TOKEN,
        displayMessage: displayMessage ? displayMessage : "Not Authorized",
        code: 4033,
        logout : false,
        redirect: "/error",
        errorDetails: [],
        data: {}
    };
}

export function invalidRefreshTokenError(displayMessage) : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_AUTH_INVALID_REFRESH_TOKEN,
        displayMessage: displayMessage ? displayMessage : "Invalid Refresh Token",
        code: -1,
        logout : true,
        redirect: "/signIn",
        errorDetails: [],
        data: {}
    };
}

export function allTokensExpired() : ErrorType {
    return {
        id: UUID(),
        name: errConst.ERROR_AUTH_ALL_TOKENS_EXPIRED,
        displayMessage: "All tokens have expired, pleas login.",
        code: -1,
        logout : true,
        redirect: "/signIn",
        errorDetails: [],
        data: {}
    };
}