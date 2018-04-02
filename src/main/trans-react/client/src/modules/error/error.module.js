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

import logger from '../../utils/logger.util';
import type {ErrorType} from './error.type';
import type {ErrorState} from './error.state';
import * as errConst from "./error.const";

const source = "error.module.js";

type AddErrorAction = {
    type: errConst.ADD_ERROR_ACTION,
    error: ErrorType,
    errors: ErrorType[]
};

type DismissAllErrorAction = {
    type: errConst.DISMISS_ALL_ERROR_ACTION,
    errors: ErrorType[]
};

type DismissErrorAction = {
    type: errConst.DISMISS_ERROR_ACTION,
    errors: ErrorType[]
};

type UnlockErrorAction = {
    type: errConst.UNLOCK_ERROR_ACTION
};

type Action =
    AddErrorAction
    | DismissAllErrorAction
    | DismissErrorAction;

const defaultErrorState: ErrorState = {
    locked: false,
    hasErrors: false,
    logout: false,
    redirect: null,
    errors: []
};

export default function reducer(errorState: ErrorState = defaultErrorState, action: Action): ErrorState {
    logger.info({func: "reducer()", message:"SWITCH_START", errorState: errorState, action: action}, source);
    switch (action.type) {
        case errConst.ADD_ERROR_ACTION:
            return {
                locked: true,
                hasErrors: true,
                logout: action.error.logout,
                redirect: action.error.redirect,
                errors: action.errors
            };
        case errConst.DISMISS_ALL_ERROR_ACTION:
            return {
                locked: errorState.locked,
                hasErrors: errorState.errors.length > 0,
                logout: errorState.logout,
                redirect: errorState.redirect,
                errors: action.errors
            };
        case errConst.DISMISS_ERROR_ACTION:
            return {
                locked: errorState.locked,
                hasErrors: errorState.errors.length > 0,
                logout: errorState.logout,
                redirect: errorState.redirect,
                errors: action.errors
            };
        case errConst.UNLOCK_ERROR_ACTION:
            return {
                locked: false,
                hasErrors: errorState.errors.length > 0,
                logout: false,
                redirect: null,
                errors: errorState.errors
            };
        default:
            return {
                locked: errorState.locked,
                hasErrors: errorState.errors.length > 0,
                logout: errorState.logout,
                redirect: errorState.redirect,
                errors: errorState.errors
            }
    }
}

export function addError(errorType: ErrorType, errors : ErrorType[]): AddErrorAction {
    return {
        type: errConst.ADD_ERROR_ACTION,
        error: errorType,
        errors: errors
    };
}

export function dismissAllError(errors : ErrorType[]): DismissAllErrorAction {
    return {
        type: errConst.DISMISS_ALL_ERROR_ACTION,
        errors: errors
    };
}

export function dismissError(errors : ErrorType[]): DismissErrorAction {
    return {
        type: errConst.DISMISS_ERROR_ACTION,
        errors: errors
    };
}

export function unlock(): UnlockErrorAction {
    return {
        type: errConst.UNLOCK_ERROR_ACTION
    };
}

export function doAddError(errorType: ErrorType): Thunk<AddErrorAction> {
    logger.info({func: "doAddError()", errorType: errorType}, source);
    return (dispatch, getState) => {
        let newErrors = getState().error.errors.concat(errorType);
        dispatch(addError(errorType, newErrors));
    };
}

export function doDismissAllError(): Thunk<DismissAllErrorAction> {
    logger.info({func: "doDismissAllError()"}, source);
    return (dispatch, getState) => {
        let newErrors = getState().error.errors.splice(0, dispatch.store.error.errors.length);
        dispatch(dismissAllError(newErrors));
    };
}

export function doDismissError(errorType: ErrorType): Thunk<DismissErrorAction> {
    logger.info({func: "doDismissError()", errorType: errorType}, source);
    return (dispatch, getState) => {
        let newErrors = getState().error.errors.filter((e) => {return e.id !== errorType.id});
        dispatch(dismissError(newErrors));
    };
}

export function doUnlock(): Thunk<UnlockErrorAction> {
    logger.info({func: "doUnlock()"}, source);
    return dispatch => {
        dispatch(unlock());
    };
}