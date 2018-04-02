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
import type {Thunk} from '../';
import {push} from "react-router-redux";
import {Route} from "react-router";

import logger from '../../utils/logger.util';
import * as authConst from "./auth.const";
import {requestToken, validateLocalStorageUser} from "./auth.util";
import {addError, doAddError} from '../error/error.module';
import type {AuthState} from "./auth.state";
import {UserType} from "../user/user.type";

const source = "auth.module.js";

type AuthenticatedAction = {
    type: authConst.AUTH_AUTHENTICATED,
    user: UserType
};

type AuthLogOutAction = {
    type: authConst.AUTH_LOG_OUT
};

type AuthStateLoadAction = {
    type: authConst.AUTH_STATE_LOAD,
    user: UserType
};

type AuthStateSaveAction = {
    type: authConst.AUTH_STATE_SAVE,
    user: UserType
};

type AuthBadCredentialsAction = {
    type: authConst.AUTH_STATE_CLEAR
};

type AuthBadCredentialsClearAction = {
    type: authConst.AUTH_STATE_CLEAR
};

type AuthStateClearAction = {
    type: authConst.AUTH_STATE_CLEAR
};


type AuthSignInRedirectAction = {
    type: authConst.AUTH_SIGN_IN_REDIRECT
};

type Action =
    AuthenticatedAction
    | AuthLogOutAction
    | AuthSignInRedirectAction
    | AuthBadCredentialsAction
    | AuthBadCredentialsClearAction
    | AuthStateLoadAction
    | AuthStateSaveAction
    | AuthStateClearAction;

const defaultState = {
    signedIn: false,
    authLoadState: 'AUTH_LOAD_STATE_NOT_STARTED',
    isBadCredentials: false,
    authorities: [{name: authConst.ROLE_ANONYMOUS}],
    redirect: null
};

export default function reducer(authState: AuthState = defaultState, action: Action): AuthState {
    logger.info({func: "reducer()", message: "SWITCH_START", authState: authState, action: action}, source);
    switch (action.type) {
        case authConst.AUTH_AUTHENTICATED:
            return {
                signedIn: true,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: false,
                authorities: action.user.authorities,
                redirect: null
            };
        case authConst.AUTH_LOG_OUT:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: false,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: '/signIn'
            };
        case authConst.AUTH_BAD_CREDENTIALS:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: true,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: null
            };
        case authConst.AUTH_BAD_CREDENTIALS_CLEAR:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: true,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: null
            };
        case authConst.AUTH_STATE_LOAD:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_STARTED',
                isBadCredentials: false,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: null
            };
        case authConst.AUTH_STATE_SAVE:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: false,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: null
            };
        case authConst.AUTH_STATE_CLEAR:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: false,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: '/signIn'
            };
        case authConst.AUTH_SIGN_IN_REDIRECT:
            return {
                signedIn: false,
                authLoadState: 'AUTH_LOAD_STATE_COMPLETED',
                isBadCredentials: false,
                authorities: [{name: authConst.ROLE_ANONYMOUS}],
                redirect: '/signIn'
            };
        default:
            return authState;
    }
}

export function authenticated(user: UserType): AuthenticatedAction {
    logger.info({func: "authenticated()"}, source);
    return {
        type: authConst.AUTH_AUTHENTICATED,
        user: user
    };
}

export function logOut() : AuthLogOutAction {
    logger.info({func: "logOut()"}, source);
    return {
        type: authConst.AUTH_LOG_OUT
    };
}

export function signInRedirect(): AuthSignInRedirectAction {
    logger.info({func: "signInRedirect()"}, source);
    return {
        type: authConst.AUTH_SIGN_IN_REDIRECT
    };
}

export function badCredentials(): AuthBadCredentialsAction {
    logger.info({func: "badCredentials()"}, source);
    return {
        type: authConst.AUTH_BAD_CREDENTIALS,
    };
}

export function badCredentialsClear(): AuthBadCredentialsClearAction {
    logger.info({func: "badCredentialsClear()"}, source);
    return {
        type: authConst.AUTH_BAD_CREDENTIALS_CLEAR
    };
}

export function loadAuthState(): AuthStateLoadAction {
    logger.info({func: "loadAuthState()"}, source);
    return {
        type: authConst.AUTH_STATE_LOAD
    };
}

export function save(user: UserType): AuthStateSaveAction {
    logger.info({func: "save()"}, source);
    return {
        type: authConst.AUTH_STATE_SAVE,
        user: user
    };
}

export function authStateClear(): AuthStateClearAction {
    logger.info({func: "authStateClear()"}, source);
    return {
        type: authConst.AUTH_STATE_CLEAR
    };
}

export function doLogin(username: string, password: string, route: Route): Thunk<AuthenticatedAction> {
    logger.info({func: "doLogin()"}, source);
    return dispatch => {
        return requestToken(username, password)
            .then((response: { data: UserType}) => {
                dispatch(push(route));
                dispatch(save(response.data));
                dispatch(authenticated(response.data));
            })
            .catch(error => {
                if (error) {
                    logger.error({func: "doLogin()", error: error}, source);
                    if (error.code === 400) {
                        dispatch(badCredentials());
                    } else {
                        dispatch(doAddError(error));
                    }
                }
            });
    };
}

export function doValidateLocalStorageUser(user: UserType, route: Route): Thunk<AuthenticatedAction> {
    logger.info({func: "doValidateLocalStorageUser()"}, source);
    return dispatch => {
        return validateLocalStorageUser(user)
            .then((response: UserType) => {
                dispatch(push(route));
                dispatch(save(response));
                dispatch(authenticated(response));
            })
            .catch(error => {
                if (error) {
                    logger.error({func: "doValidateLocalStorageUser()", error: error}, source);
                    if (error.code === 400) {
                        dispatch(badCredentialsClear());
                    } else {
                        dispatch(addError(error));
                    }
                }
            });
    };
}

export function doLogOut(): Thunk<AuthStateClearAction> {
    logger.info({func: "doLogOut()"}, source);
    return dispatch => {
        dispatch(authStateClear());
    };
}