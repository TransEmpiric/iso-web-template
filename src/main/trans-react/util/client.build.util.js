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
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const fs = require('fs-extra');

require('../client/config/env');
const paths = require('../client/config/paths');
const TransLoggerUtil = require('./trans.logger.util');

const log = new TransLoggerUtil('client.build.util.js', 'CLIENT');
const REQUIRED_FILES = [paths.appPublicTemplateIndex, paths.appSrcJsIndex];
const BUILD_NAME = 'CLIENT BUILD';
const copyOptions = { dereference: true };

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
    if (!checkRequiredFiles(REQUIRED_FILES)) {
        log.error(`Required files for ${BUILD_NAME} not found:\n${REQUIRED_FILES}`, true);
    }
};

/*
*****************************************
********** Clean Functions **************
*****************************************
*/

/*
 * Base Clean function, cleans appBuild, appDist and refreshes appBuildStatic
 * Synchronous.
 */
exports.cleanSync = () => {
    log.debug(`Cleaning ${BUILD_NAME} appBuild directory`);
    fs.emptyDirSync(paths.appBuild);

    log.debug(`Refreshing ${BUILD_NAME} appPublic for appBuildStatic directory`);
    copyPublicFolder();

    log.debug(`Cleaning ${BUILD_NAME} appDist (${paths.appDist}) directory`);
    fs.emptyDirSync(paths.appDist);
};

/*
*****************************************
*********** Copy Functions **************
*****************************************
*/

/*
 * Copies the built assets (asset-manifest.json, css, js, images, icons, and fonts)
 * to the distribution directories.
 * Synchronous.
 */
function copyAppBuildToAppDistSync() {
    log.debug(`Copying ${BUILD_NAME} appBuildStatic from appBuild to appDist`);
    fs.copySync(paths.appBuildStatic, paths.appDist, copyOptions);
}

/*
 * Copies appPublic to appBuildStaticPublic
 * Excludes appPublicTemplate directory
 * appPublicTemplatesIndex is built and copied to appBuild by webpack
 * Synchronous.
 */
function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuildStaticPublic, {
        dereference: true,
        filter: file => file !== paths.appPublicTemplate,
    });
}

/*
 * Base call to copy assets to the distribution (appDist) directory.
 * Synchronous.
 */
exports.distribution = () => {
    log.debug(`Starting ${BUILD_NAME} distribution`);
    return copyAppBuildToAppDistSync();
};

/*
*****************************************
*********** Util Functions **************
*****************************************
*/

/* Prints environment and path info if process.env.DEBUG_LEVEL === 'DEBUG' */
function debugInfo() {
    if (process.env.DEBUG_LEVEL !== 'DEBUG') return;

    log.debug(BUILD_NAME + ' environment => [ ' +
        'NODE_ENV: ' + process.env.NODE_ENV + ', ' +
        'BABEL_ENV: ' + process.env.BABEL_ENV + ', ' +
        'DEBUG_LEVEL: ' + process.env.DEBUG_LEVEL + ' ' +
        ']'
    );

    log.debug(`${BUILD_NAME} appBuild paths:`);
    log.debug(`${BUILD_NAME} appBuild path: ${paths.appBuild}`);
    log.debug(`${BUILD_NAME} appBuildStaticJs path: ${paths.appBuildStaticJs}`);
    log.debug(`${BUILD_NAME} appBuildStaticCss path: ${paths.appBuildStaticCss}`);
    log.debug(`${BUILD_NAME} appBuildStaticJsManifest path: ${paths.appBuildStaticJsManifest}`);

    log.debug(`${BUILD_NAME} appDist paths:`);
    log.debug(`${BUILD_NAME} appDist path: ${paths.appDist}`);
    log.debug(`${BUILD_NAME} appDistCss path: ${paths.appDistCss}`);
    log.debug(`${BUILD_NAME} appDistJs path: ${paths.appDistJs}`);
    log.debug(`${BUILD_NAME} appDistJsManifest path: ${paths.appDistJsManifest}`);

    log.debug(`${BUILD_NAME} appPublic paths:`);
    log.debug(`${BUILD_NAME} appPublic path: ${paths.appPublic}`);
    log.debug(`${BUILD_NAME} appPublicTemplateIndex path: ${paths.appPublicTemplateIndex}`);

    log.debug(`${BUILD_NAME} appSrc paths:`);
    log.debug(`${BUILD_NAME} appSrc path: ${paths.appSrc}`);
    log.debug(`${BUILD_NAME} appSrcJsIndex path: ${paths.appSrcJsIndex}`);

    log.debug(`${BUILD_NAME} Config paths:`);
    log.debug(`${BUILD_NAME} appNodeModules path: ${paths.appNodeModules}`);
    log.debug(`${BUILD_NAME} appPackageJson path: ${paths.appPackageJson}`);
    log.debug(`${BUILD_NAME} dotenv path: ${paths.dotenv}`);
    log.debug(`${BUILD_NAME} publicUrl path: ${paths.publicUrl}`);
    log.debug(`${BUILD_NAME} servedPath path: ${paths.servedPath}`);

    log.debug(`${BUILD_NAME} Test paths:`);
    log.debug(`${BUILD_NAME} testsSetup path: ${paths.testsSetup}`);
}