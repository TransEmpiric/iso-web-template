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
import URI from "urijs";

import {
    allTokensExpired, invalidAuthTokenError,
    invalidRefreshTokenError, noLocalStorageUserError
} from "../error/error.type";
import logger from '../../utils/logger.util';
import {backoff} from "../../utils/backoff.util";
import * as xhr from "../../network/xhr";
import * as authConst from "./auth.const";
import {UserType} from "../user/user.type";
import * as connectionSettings from "../../config/connection.config";

const source = "auth.util.js";

export const requestToken = (username, password) =>
    xhr.request(createAuthTokenRequest(username, password));

export const refreshToken = (username, refresh_token) =>
    xhr.request(createRefreshTokenRequest(username, refresh_token))
        .then(
            success => {
                logger.info({func: "refreshToken()", message: "SUCCESS, calling setLocalStorageUser()", resp: success}, source);
                setLocalStorageUser(success.data);
                return Promise.resolve(success.data);
            },
            error => {
                logger.error({func: "refreshToken()", message: "ERROR, calling invalidRefreshTokenError()", error: error}, source);
                return Promise.reject(invalidRefreshTokenError("Refresh token was not expired, but was invalid, according to the server."));
            }
        );

export function createAuthTokenRequest(username, password) {
    const encodedPassword = new Buffer(password).toString('base64');
    return {
        url: URI("/api/auth/token").toString(),
        data: {username: username, password: encodedPassword}
    }
}

export function createRefreshTokenRequest(username, refresh_token) {
    return {
        url: URI("/api/auth/refresh").toString(),
        data: {username: username, refresh_token: refresh_token}
    }
}

export const validateLocalStorageUser = (user: UserType) => {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject(noLocalStorageUserError());
            return null;
        }

        const auth_token = user.auth_token;
        const auth_expiration = user.auth_expiration;
        if (!auth_token && !auth_expiration) {
            logger.info({func: "validateLocalStorageUser", message: "No auth auth_token or auth_expiration in local storage."}, source);
            reject(invalidAuthTokenError("No auth auth_token or auth_expiration in local storage."));
            return null;
        }

        const refresh_token = user.refresh_token;
        const refresh_expiration = user.refresh_expiration;
        if (!refresh_token && !refresh_expiration) {
            logger.info({func: "validateLocalStorageUser", message: "No auth refresh_token or refresh_expiration in local storage."}, source);
            reject(invalidRefreshTokenError("No auth refresh_token or refresh_expiration in local storage."));
            return null;
        }

        const isAuthTokenExpired = isTokenExpired(auth_expiration);
        const isRefreshTokenExpired = isTokenExpired(refresh_expiration);
        if (isAuthTokenExpired && !isRefreshTokenExpired) {
            logger.info({func: "validateLocalStorageUser", message: "Auth token is expired, but refresh_token is not: trying refresh_token"}, source);
            if (!user.username) {
                logger.info({func: "validateLocalStorageUser", message: "No username in local storage, rejecting Promise with invalidRefreshTokenError()"}, source);
                reject(invalidRefreshTokenError("No auth refresh_token or refresh_expiration in local storage."));
                return null;
            }

            const username = user.username;


            backoff(
                () => refreshToken(username, refresh_token),
                {
                    attempts: 3,
                    minDelay: 1000,
                    maxDelay: 10000
                }
            ).then(
                success => resolve(success),
                error => reject(error)
            );
        } else if (isAuthTokenExpired && isRefreshTokenExpired) {
            reject(allTokensExpired());
        } else {
            resolve(user);
        }
    });
};

export function isAuthorized(allowedAuthorities, userAuthorities): boolean {
    let needsAuthority = false;
    let hasAuthority = false;
    let needsPrivileges = false;
    let hasPrivileges = true;
    let requiredPrivileges = [];
    let userPrivileges = [];

    // There are no Authorities required/
    if (!allowedAuthorities || allowedAuthorities.length < 1) return true;

    // There is a list of allowedAuthorities but userAuthorities is empty
    if (!userAuthorities || userAuthorities.length < 1) return false;

    for (let i = 0; i < allowedAuthorities.length; i++) {
        let isRole = (allowedAuthorities[i].indexOf('ROLE') !== -1);
        let isPrivilege = !isRole;

        // SEPARATE ROLES FROM PRIVILEGES
        // User will need all PRIVILEGES
        // LOOP through them later
        if (isPrivilege) {
            needsPrivileges = true;
            requiredPrivileges.push(allowedAuthorities[i]);
            continue;
        }

        //  User only needs one ROLE in the list
        for (let j = 0; j < userAuthorities.length; j++) {
            needsAuthority = true;
            isRole = (userAuthorities[i].name.indexOf('ROLE') !== -1);
            isPrivilege = !isRole;

            if (isPrivilege) {
                userPrivileges.push(userAuthorities[j].name);
                continue;
            }

            if (allowedAuthorities[i] === userAuthorities[j].name) hasAuthority = true;
        }
    }

    // User will need all PRIVILEGES
    if (needsPrivileges) {
        hasPrivileges = requiredPrivileges.every(function (val) {
            return userPrivileges.indexOf(val) >= 0;
        });
    }


    if ((needsAuthority && !hasAuthority) || (needsPrivileges && !hasPrivileges)) return false;

    return true;
}

export function getLocalStorageUser(): UserType {
    const localStorageUser = localStorage.getItem(authConst.LOCAL_STORAGE_KEY_USER);
    if (localStorageUser) {
        logger.info({func: "getLocalStorageUser", message: "Found User Data in LocalStorage"}, source);
        return JSON.parse(localStorageUser);
    }
    logger.info({func: "getLocalStorageUser", message: "Did NOT find User Data in LocalStorage"}, source);
    return null;
}

export function isTokenExpired(expiration : number): boolean {
    logger.info({func: "isTokenExpired()", expiration: expiration}, source);
    if (!expiration) return true;

    const remainingTime = (expiration - Date.now());
    logger.info({func: "isTokenExpired()", remainingTime: remainingTime}, source);

    // token is expired if lifetime (in milli) smaller then connection timeout (in milli)
    return (remainingTime < connectionSettings.TIMEOUT);
}

export function setLocalStorageUser(user: UserType): void {
    localStorage.setItem(authConst.LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
}

export function removeLocalStorageUser(): void {
    localStorage.removeItem(authConst.LOCAL_STORAGE_KEY_USER);
}