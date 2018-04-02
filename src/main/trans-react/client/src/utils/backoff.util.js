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
import logger from './logger.util';
const source = "backoff.util.js";

const delay = time => {
    logger.info({func: "delay()", delayTimeInMillis: time}, source);
    return new Promise(resolve => setTimeout(resolve, time));
};

export const backoff = (promise, config) => {
    config.delay = config.hasOwnProperty("delay") ? config.delay * 2 : config.minDelay;
    config.attempts = config.attempts - 1;
    logger.info({func: "backoff()", config: config}, source);
    return promise()
        .catch((error) => {
            if (config.delay > config.maxDelay || config.attempts <= 0) {
                logger.error({func: "backoff()", message: "ERROR, rejecting Promise", error: error}, source);
                return Promise.reject(error);
            } else {
                logger.info({func: "backoff()", message: "RECURSION"}, source);
                return delay(config.delay).then(() => backoff(promise, config));
            }
        });
};