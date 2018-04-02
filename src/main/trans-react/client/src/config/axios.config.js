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

// @flow
import axios from "axios";

import logger from '../utils/logger.util';
import * as connectionSettings from "./connection.config";
import * as busySettings from "./busy.config";
import * as auth from "../modules/auth/auth.module";
import * as authUtils from "../modules/auth/auth.util";
import {doAddError} from "../modules/error/error.module";
import {appBusy, appReady} from "../modules/app/app.module";
import {accessDeniedError} from "../modules/error/error.type";

const source = "axios.config.js";

const axiosConfig = dispatch => {
    requestInterceptor(dispatch);
    responseInterceptor(dispatch);
};

const requestInterceptor = dispatch => {
    axios.interceptors.request.use(config => {
        dispatch(appBusy());

        config.timeout = connectionSettings.TIMEOUT;
        config.headers["Accept"] = "application/json;charset=UTF-8";
        config.headers["Content-Type"] = "application/json;charset=UTF-8";

        let cancel;
        config.cancelToken = new axios.CancelToken(c => {
            cancel = c;
        });

        const cancelRequest = message => {
            cancel(message);
            return config;
        };

        const localStorageUser = authUtils.getLocalStorageUser();

        return authUtils.validateLocalStorageUser(localStorageUser)
            .then(user => {
                config.headers["Authorization"] = `Bearer ${user.auth_token}`;
                return config;
            })
            .catch(error => {
                logger.error({func: "requestInterceptor()", message: "AXIOS_REQ_INTERCEPT_ERR: INVALID_TOKENS, canceling request", error: error}, source);
                return cancelRequest(error);
            });
    }, error => {
        logger.error({func: "requestInterceptor()", message: "AXIOS_REQ_INTERCEPT_ERR", error: error}, source);
        return Promise.reject(error);
    });
};

const responseInterceptor = dispatch => {
    axios.interceptors.response.use(response => {
        return pause()
            .then(() => dispatch(appReady()))
            .then(() => response);
    }, error => {
        return pause()
            .then(() => dispatch(appReady()))
            .then(() => {
                // if cancelled do log out if set
                if (error instanceof axios.Cancel) {
                    logger.error(
                        {
                            func: "responseInterceptor()",
                            message: "Error is instanceof axios.Cancel",
                            error: error
                        }, source
                    );

                    if (error.message.logout === true) {
                        logger.error(
                            {
                                func: "responseInterceptor()",
                                message: "Error has error.message.logout === true, dispatching auth.doLogOut(error.message)",
                                error: error
                            }, source
                        );

                        dispatch(auth.doLogOut(error.message));

                        return Promise.reject(error.message);
                    }

                    logger.error(
                        {
                            func: "responseInterceptor()",
                            message: "Error has error.message.logout === false, dispatching auth.signInRedirect()",
                            error: error
                        }, source
                    );

                    dispatch(auth.signInRedirect());
                    return Promise.reject(error.message);
                }

                // if unauthorized (401) do log out
                const status = (error && error.response && error.response.status) ? error.response.status : 0;
                if (status === 401) {
                    logger.error(
                        {
                            func: "responseInterceptor()",
                            message: "Error has status === 401, dispatching, auth.doLogOut()",
                            error: error
                        },
                        source
                    );

                    dispatch(auth.doLogOut());
                    return Promise.reject(null);
                }

                if (status === 403) {
                    logger.error(
                        {
                            func: "responseInterceptor()",
                            message: "Error has status === 403, dispatching doAddError(accessDeniedError())",
                            error: error
                        },
                        source
                    );

                    dispatch(doAddError(accessDeniedError()));
                    return Promise.reject(error);
                }

                logger.error(
                    {
                        func: "responseInterceptor()",
                        message: "Error not handle in responseInterceptor, dispatching dispatch(doAddError(error))",
                        error: error
                    },
                    source
                );
                dispatch(doAddError(error));
                return Promise.reject(error);
            });
    });
};

const pause = () => new Promise(resolve => setTimeout(resolve, busySettings.TIMEOUT));

export default axiosConfig;