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
import * as connectionSettings from "../config/connection.config";

import logger from '../utils/logger.util';
import {httpError, networkError} from "../modules/error/error.type";
import * as errConst from "../modules/error/error.const";

const source = "xhr.js";

export const request = options => {
    return new Promise((resolve, reject) => {
        const xmlHttp = new XMLHttpRequest();
        logger.info({func: "request()", options: options}, source);

        xmlHttp.timeout = connectionSettings.TIMEOUT;
        xmlHttp.onload = () => onLoad(xmlHttp, resolve, reject);
        xmlHttp.ontimeout = () => onTimeout(xmlHttp, resolve, reject);
        xmlHttp.onerror = () => onError(xmlHttp, resolve, reject);
        xmlHttp.open("POST", options.url, true);

        if(options.data) {
            xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            logger.info({func: "request()", messge: "Doing JSON request"}, source);
            xmlHttp.send(JSON.stringify(options.data));
        } else {
            logger.info({func: "request()", messge: "Doing regular request"}, source);
            xmlHttp.send();
        }
    });
};

export const onError = (xmlHttp, resolve, reject) => {
    logger.error({func: "onError()", message: "XHR ERROR", xmlHttp: xmlHttp}, source);
    reject(networkError());
};

export const onTimeout = (xmlHttp, resolve, reject) => {
    logger.error({func: "onTimeout()", message:"XHR_NETWORK_TIME_OUT", xmlHttp: xmlHttp}, source);
    reject(networkError('XHR_NETWORK_TIMEOUT', "The network has timed out", -2, false, null, null, null));
};

export const onLoad = (xmlHttp, resolve, reject) => {
    const result = createResultObject(xmlHttp);
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        logger.info({func: "onLoad() SUCESS", xmlHttp: xmlHttp}, source);
        resolve(result);
    } else if (xmlHttp.status >= 400) {
        logger.error({func: "onLoad()", message: "XHR_ON_LOAD_ERROR" , error: result}, source);

        let msgName = "XHR_ON_LOAD_ERROR",
            msg = "An xhr error has occurred",
            errorType = errConst.ERROR_UNKNOWN;

        if (result.data) {
            if (result.data.displayMessage) {
                msgName =  result.data.displayMessage;
                msg = msgName;
            }

            if (xmlHttp.status === 401 || xmlHttp.status === 403) errorType = "AUTH";
        }

        reject(httpError(msgName, msg, result.status, false, null, [{name: msgName, errorType:errorType, message: msg}], result.data));
    }
};

export const createResultObject = xmlHttp => {
    const result = {
        status: xmlHttp.status,
        statusText: xmlHttp.statusText
    };

    if (xmlHttp.responseText.length <= 0) {
        return ({
            ...result,
        });
    } else {
        try {
            const data = JSON.parse(xmlHttp.responseText);
            return ({
                ...result,
                data
            });

        } catch (e) {
            return ({
                ...result,
                data: xmlHttp.responseText
            });
        }
    }
};