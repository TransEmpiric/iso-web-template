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

import logger from '../utils/logger.util';
import * as authUtils from "../modules/auth/auth.util";
import * as auth from "../modules/auth/auth.module";

const source = "auth.state.middleware.js";

const authState = store => next => action => {
    logger.info({func: "authState()", message:"SWITCH_START", store: store.getState(), action}, source);
    switch (action.type) {
        case 'AUTH_STATE_LOAD':
            const user = authUtils.getLocalStorageUser();
            if (user && user.auth_token && user.auth_token.length > 0) {
                logger.info({func:"authState()", message: "Found localStorage auth_token, dispatching auth.validateLocalStorageUser()"}, source);
                return next(auth.doValidateLocalStorageUser(user));
            } else {
                logger.info({func:"authState()", message: "auth_token empty, dispatching auth.logOut()"}, source);
                return next(auth.logOut());
            }
        case 'AUTH_STATE_SAVE':
            authUtils.setLocalStorageUser(action.user);
            return next(auth.authenticated(action.user));
        case 'AUTH_STATE_CLEAR':
            authUtils.removeLocalStorageUser();
            return next(auth.logOut());
        default:
            return next(action);
    }
};

export default authState;