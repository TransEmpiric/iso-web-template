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
 * Toggle env variables with process.env as desired
 */
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
process.env.BABEL_ENV = process.env.BABEL_ENV ? process.env.BABEL_ENV : 'production';
process.env.DEBUG_LEVEL = process.env.DEBUG_LEVEL ? process.env.DEBUG_LEVEL : 'INFO';

/* Load configuration first. */
require('../config/env');
const paths = require('../config/paths');
const config = require('../config/webpack.config.prod');

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const webpack = require('webpack');

const TransLoggerUtil = require('../../util/trans.logger.util');
const buildUtil = require('../../util/client.build.util.js');
const {clientInstructions} = require('../../util/instruct.util');

const log = new TransLoggerUtil('client.prod.build.js', 'CLIENT');
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const BUILD_NAME = 'CLIENT PROD BUILD';
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

/* Init the build */
buildUtil.init();

measureFileSizesBeforeBuild(paths.appBuild)
    .then(
        previousFileSizes => {
            log.info(`!###Starting ${BUILD_NAME}`);
            buildUtil.cleanSync();
            return build(previousFileSizes);
        }
    )
    .then(
        ({stats, previousFileSizes, warnings}) => {
            buildUtil.distribution();
            printBuildResults(stats, previousFileSizes, warnings);
        },
        err => {
            log.error(`${BUILD_NAME} FAILED.`, true, err);
        }
    );

/* Create the production build. */
function build(previousFileSizes) {
    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
        log.info('Starting Webpack build process');
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const messages = formatWebpackMessages(stats.toJson({}, true));
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }

            if (process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length) {
                log.error('"process.env.CI = true" => Treating warnings as errors.', false);
                return reject(new Error(messages.warnings.join('\n\n')));
            }

            return resolve({
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            });
        });
    });
}

/* Util function to print webpack build results. */
function printBuildResults(stats, previousFileSizes, warnings) {
    if (warnings.length) {
        log.warn(`${BUILD_NAME} compiled with warnings.`);
        console.log(warnings.join(''));
    } else {
        log.debug(`${BUILD_NAME} compiled successfully.`);
    }

    log.info(`!###${BUILD_NAME} finished SUCCESSFULLY!`);

    printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
    );

    const appPackage = require(paths.appPackageJson);
    const publicUrl = paths.publicUrl;
    const publicPath = config.output.publicPath;

    console.log('');
    clientInstructions(
        appPackage,
        publicUrl,
        publicPath
    );
}