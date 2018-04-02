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

/**** Load configuration first to ensure correct paths ****/
require('../config/env');
const paths = require('../config/paths');

const fs = require('fs-extra');
const babel = require('babel-core');

const TransLoggerUtil = require('../../util/trans.logger.util');
const buildUtil = require('../../util/ssr.build.util.js');
const {ssrInstructions} = require('../../util/instruct.util');

const log = new TransLoggerUtil('ssr.build.js', 'SSR');
const BUILD_NAME = 'SSR BUILD';

/* Init the build */
buildUtil.init();

log.info(`!###Starting ${BUILD_NAME}`);
buildUtil.cleanSync();
build().then(
    log.debug(`${BUILD_NAME} completed.`),
    err => {
        log.error(`!###${BUILD_NAME} FAILED.`, true, err);
    }
).then(
    () => {
        buildUtil.distribution();
        log.info(`!###${BUILD_NAME} finished SUCCESSFULLY!`);
        ssrInstructions();
    }
);

/* Create the SSR build. */
function build() {
    return new Promise((resolve) => {
        const output = fs.createWriteStream(paths.appBuildRenderer);

        output.write('// polyfill.js\n\n');

        /*
         *   Babel breaks the polyfill.
         *   Keep it out of Babel trans-compile and prepend to output atm.
        */
        output.write(fs.readFileSync(paths.appPolyfill, 'utf8'));

        /*
         *   Add appManifest
        */
        output.write('\n// asset-manifest.json\nvar assetManifest = ');
        output.write(fs.readFileSync(paths.appBuildManifest, 'utf8'));
        output.write(';\n\n');

        output.write('\n// renderer.js\n\n');

        const transformedRendererJs = babel.transformFileSync(paths.appSrcSSR, {
            "presets": ["es2015"],
            "plugins": ["transform-object-rest-spread"]
        });

        output.write(transformedRendererJs.code);

        output.on('finish', () => {
            log.debug(`Completed ${BUILD_NAME} ssr.js file creation.`);
            return resolve( {} );
        });

        output.end();
    });
}