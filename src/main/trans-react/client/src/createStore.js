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
import {applyMiddleware, compose, createStore} from 'redux';

import axiosConfig from "./config/axios.config";
import reducers from './modules/index';
import thunk from 'redux-thunk';

import authStateMiddleware from "./middleware/auth.state.middleware";

export default function configureStore(initialState: Object): Store {
    const store = createStore(reducers, initialState, compose(
        applyMiddleware(authStateMiddleware, thunk),

        /* Detect devtools browser extension */
        (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : fn => fn
    ));

    /* Configure axios for API calls */
    const dispatch = store.dispatch;
    axiosConfig(dispatch, store.getState);

    /* The Redux store can not be hot-reloaded, but the reducers can be. */
    if (module.hot) {
        module.hot.accept('./modules', () => store.replaceReducer(reducers));
    }

    return store;
}