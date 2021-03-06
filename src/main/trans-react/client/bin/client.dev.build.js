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

'use strict';

/*
 * Note:
 * Toggle env variables by uncommenting as desired
 */
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
process.env.BABEL_ENV = process.env.BABEL_ENV ? process.env.BABEL_ENV : 'development';
// process.env.DEBUG_LEVEL = process.env.DEBUG_LEVEL ? process.env.DEBUG_LEVEL : 'INFO';
process.env.DEBUG_LEVEL = process.env.DEBUG_LEVEL ? process.env.DEBUG_LEVEL : 'DEBUG';

/* Load configuration first. */
require('../config/env');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const {
    choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');

const createDevServerConfig = require('../config/webpackDevServer.config');
const TransLoggerUtil = require('../../util/trans.logger.util');
const buildUtil = require('../../util/client.build.util.js');

const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const log = new TransLoggerUtil('client.dev.build.js', 'CLIENT');
const BUILD_NAME = 'CLIENT DEV BUILD';

/* Init the build */
buildUtil.init();

/*
 * We attempt to use the default port but if it is busy, we offer the user to
 * run on a different port. `detect()` Promise resolves to the next free port.
 */
choosePort(HOST, DEFAULT_PORT)
    .then(port => {
        if (port == null) {
            // We have not found a port.
            return;
        }
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
        const urls = prepareUrls(protocol, HOST, port);
        // Create a webpack compiler that is configured with custom messages.
        const compiler = createCompiler(webpack, config, appName, urls);
        // Load proxy config
        const proxySetting = require(paths.appPackageJson).proxy;
        const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
        // Serve webpack assets generated by the compiler over a web sever.
        const serverConfig = createDevServerConfig(
            proxyConfig,
            urls.lanUrlForConfig
        );
        const devServer = new WebpackDevServer(compiler, serverConfig);
        // Launch WebpackDevServer.
        devServer.listen(port, HOST, err => {
            if (err) {
                return console.log(err);
            }
            if (isInteractive) {
                clearConsole();
            }
            log.info('!###Starting the development server');
            openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
            process.on(sig, function () {
                devServer.close();
                process.exit();
            });
        });
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });