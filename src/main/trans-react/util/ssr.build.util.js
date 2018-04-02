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
const path = require('path');
const fs = require('fs-extra');

require('../ssr/config/env');
const paths = require('../ssr/config/paths');
const TransLoggerUtil = require('./trans.logger.util');

const log = new TransLoggerUtil('ssr.build.util.js', 'SSR');
const BUILD_NAME = 'SSR BUILD';
const CLIENT_BUILD_NAME = 'CLIENT BUILD';
const REQUIRED_FILES = [paths.appBuildManifest, paths.appSrcSSR, paths.appPolyfill];
const CLIENT_BUILD_HELP_MESSAGE = 'From the "trans-react" root or "trans-react/client", ' +
                                    'execute build:\n' +
                                    '    > $ npm run build';

/*
*****************************************
****** Initialize the BUILD *************
*****************************************
*/

exports.init = () => {
    log.debug('Initializing ' + BUILD_NAME);

    /* Print out helpful debug info */
    debugInfo();

    /*
     * Makes build crash on unhandled rejections.
     */
    process.on('unhandledRejection', err => {
        log.error("An Unhandled Error occurred", true, err);
    });

    log.debug(`Checking presence of required files for ${BUILD_NAME} => ${REQUIRED_FILES}`, true);
    checkRequiredFiles(REQUIRED_FILES);
};

/*
*****************************************
********** Clean Functions **************
*****************************************
*/

/* Base Clean function.
* Cleans appBuildJs and appDistJs.
* Synchronous.
*/
exports.cleanSync = () => {
    log.debug(`Cleaning ${BUILD_NAME} appBuildJs directory`);
    fs.emptyDirSync(paths.appBuildJs);

    log.debug(`Cleaning ${BUILD_NAME} js in appDistJs directory (${paths.appDistJs}).`);
    fs.emptyDirSync(paths.appDistJs);
};

/*
*****************************************
*********** Copy Functions **************
*****************************************
*/

/*
 * Copies the built assets (renderer.js)
 * to the js distribution directories (appDistJs & appDistCss).
 * Synchronous.
 */
function copyAppBuildToAppDistSync() {
    log.debug(`Copying ${BUILD_NAME} appBuildJsRenderer from appBuildJs to appDistJs`);
    fs.copySync(paths.appBuildRenderer, paths.appDistRenderer, {dereference: true});
}

/*
 * Base call to copy assets to the distribution (appDist) directory.
 * Synchronous.
 */
exports.distribution = () => {
    log.info(`Starting ${BUILD_NAME} distribution`);
    return copyAppBuildToAppDistSync();
};

/*
*****************************************
*********** Util Functions **************
*****************************************
*/

/* Prints environment and path info if process.env.DEBUG_LEVEL === 'DEBUG'  */
function debugInfo() {
    if (process.env.DEBUG_LEVEL !== 'DEBUG') return;

    log.debug(BUILD_NAME + ' environment => [ ' +
        'NODE_ENV: ' + process.env.NODE_ENV + ', ' +
        'BABEL_ENV: ' + process.env.BABEL_ENV + ', ' +
        'DE' +
        'BUG_LEVEL: ' + process.env.DEBUG_LEVEL + ' ' +
        ']'
    );

    log.debug(`${BUILD_NAME} appBuild paths:`);
    log.debug(`${BUILD_NAME} appBuild path: ${paths.appBuild}`);
    log.debug(`${BUILD_NAME} appBuildJs path: ${paths.appBuildJs}`);
    log.debug(`${BUILD_NAME} appBuildRenderer path: ${paths.appBuildRenderer}`);
    log.debug(`${BUILD_NAME} appBuildManifest path: ${paths.appBuildManifest}`);

    log.debug(`${BUILD_NAME} appDist paths:`);
    log.debug(`${BUILD_NAME} appDist path: ${paths.appDist}`);
    log.debug(`${BUILD_NAME} appDistJs path: ${paths.appDistJs}`);
    log.debug(`${BUILD_NAME} appDistRenderer path: ${paths.appDistRenderer}`);

    log.debug(`${BUILD_NAME} appDist paths:`);
    log.debug(`${BUILD_NAME} appNodeModules path: ${paths.appNodeModules}`);


    log.debug(`${BUILD_NAME} appSrc paths:`);
    log.debug(`${BUILD_NAME} appSrc path: ${paths.appSrc}`);
    log.debug(`${BUILD_NAME} appSrcSSR path: ${paths.appSrcSSR}`);

    log.debug(`${BUILD_NAME} Config paths:`);
    log.debug(`${BUILD_NAME} dotenv path: ${paths.dotenv}`);
}

/* Do required file check */
function checkRequiredFiles() {
    if (!REQUIRED_FILES) return true;

    REQUIRED_FILES.forEach(function(requiredFile){
        if (!fs.existsSync(requiredFile)){
            if (paths.appBuildManifest !== requiredFile) {
                log.error(`Required files for ${BUILD_NAME} not found:\n${requiredFile}\n`, true);
            } else {
                log.error(`Required files for ${BUILD_NAME} not found:\n${requiredFile}`, false);
                log.error(`To generate the manifest file, please run the ${CLIENT_BUILD_NAME}\n${CLIENT_BUILD_HELP_MESSAGE}`, true);
            }

            return false;
        }
    });

    return true;
}