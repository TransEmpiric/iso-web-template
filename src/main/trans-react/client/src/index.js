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
import React from 'react';
import {render as renderToDom} from 'react-dom';
import {renderToString} from 'react-dom/server';
import Helmet from 'react-helmet';
import {AppContainer} from 'react-hot-loader'
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import TransAppContainer from './containers/trans.app.container';
import configureStore from './createStore';

/*
 * Client side rendering.
 * Rehydrate the Redux store and use it to render the page.
*/
if (typeof window !== 'undefined') {
    const store = configureStore(window.__INITIAL_STATE__);

    const render = Component => {
        const app = (
            <AppContainer>
                <Provider store={store}>
                    <BrowserRouter>
                        <Component/>
                    </BrowserRouter>
                </Provider>
            </AppContainer>
        );

        renderToDom(app, document.getElementById('trans-react-root'));
    };

    render(TransAppContainer);

    /*  Register TransAppContainer for hot module replacement. */
    if (module.hot) {
        module.hot.accept('./containers/trans.app.container', () => {
            render(TransAppContainer)
        });
    }
}

/*
 * Server side rendering (SSR).
 * Exported rendering function for the Spring template engine.
*/
// eslint-disable-next-line import/prefer-default-export
export function renderApp(path: string, state: Object) {
    const store = configureStore(state);

    const markup = renderToString(
        <Provider store={store}>
            <StaticRouter
                location={path}
                context={{}}
            >
                <TransAppContainer/>
            </StaticRouter>
        </Provider>
    );

    /*
     * Release the accumulated object to avoid memory leaks.
     * Return data to parent renderer.
    */
    const head = Helmet.rewind();

    return {markup, head};
}