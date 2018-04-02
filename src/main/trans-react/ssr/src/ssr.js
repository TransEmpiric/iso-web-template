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

/* global ReactRenderer, assetManifest, Packages */
// eslint-disable-next-line no-unused-vars
const render = (function () {
    let jsBundlePath = 'static/js/trans-react-client/main.js';
    let cssBundlePath = 'static/css/trans-react/main.css';

    if (assetManifest) {
        jsBundlePath = assetManifest['main.js'];
        cssBundlePath = assetManifest['main.css'];
    }

    const serializer = (new Packages.com.fasterxml.jackson.databind.ObjectMapper()).writer();

    function getData(model) {
        const renderData = {
            data: {}
        };
        for (let key in model) {
            if (key.startsWith('__')) {
                renderData[key.substring(2)] = model[key];
            } else {
                renderData.data[key] = model[key];
            }
        }

        /*
         * Serialize the model for passing to the client.
         * Don't use JSON.stringify.
         * Nashorn does not cope with POJOs by design.
         * http://www.slideshare.net/SpringCentral/serverside-javascript-with-nashorn-and-spring
        */
        renderData.json = serializer.writeValueAsString(renderData.data);

        /* "Purify" the model by swapping it for serialised version */
        renderData.data = JSON.parse(renderData.json);

        return renderData;
    }

    /*
     * Ensure dehydrated state is safe to read in browser.
     * https://medium.com/node-security/the-most-common-xss-vulnerability-in-react-js-applications-2bdffbcc1fa0#.a9ljcm13e
    */
    const UNSAFE_CHARS_REGEXP = /[<>/\u2028\u2029]/g;

    /*
     * Map unsafe HTML and invalid JS line terminator chars.
     * Unicode chars are safe to use in JavaScript strings.
    */
    const ESCAPED_CHARS = {
        '<': '\\u003C',
        '>': '\\u003E',
        '/': '\\u002F',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
    };

    function escapeUnsafeChars(unsafeChar) {
        return ESCAPED_CHARS[unsafeChar];
    }

    function populateTemplate(markup, head, stateAsJson) {
        const safeJson = stateAsJson.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

        return `<!doctype html>
                <html ${head.htmlAttributes.toString()}>
                  <head>
                    <link rel="stylesheet" href="/${ cssBundlePath }" />
                    ${ head.base.toString() }
                    ${ head.link.toString() }
                    ${ head.meta.toString() }
                    ${ head.title.toString() }
                  </head>
                  <body>
                    <div id="trans-react-root">${markup}</div>
                    <script>window.__INITIAL_STATE__ = ${safeJson}</script>
                    <script src="/${ jsBundlePath }"></script>
                 </body>
                </html>`;
    }

    /*
     * Spring calls this function with the view name and model data.
     * The "viewName" is not used.
    */
    return function (_viewName, model) {
        const {
            requestPath,
            data,
            json
        } = getData(model);

        const {
            markup,
            head
        } = ReactRenderer.renderApp(requestPath, data);

        return populateTemplate(markup, head, json);
    };
})();