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

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');
const url = require('url');
const globalModules = require('global-modules');
const fs = require('fs');

function printHostingInstructions(
    appPackage,
    publicUrl,
    publicPath,
    buildFolder
) {
    const publicPathname = url.parse(publicPath).pathname;
    if (publicUrl && publicUrl.indexOf('.github.io/') !== -1) {
        // "homepage": "http://user.github.io/project"
        console.log(
            `The project was built assuming it is hosted at ${chalk.green(
                publicPathname
            )}.`
        );
        console.log(
            `You can control this with the ${chalk.green(
                'homepage'
            )} field in your ${chalk.cyan('package.json')}.`
        );
        console.log();
        console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
        console.log(`To publish it at ${chalk.green(publicUrl)}, run:`);
        // If script deploy has been added to package.json, skip the instructions
        if (typeof appPackage.scripts.deploy === 'undefined') {
            console.log();
            console.log(
                `Add the following script in your ${chalk.cyan('package.json')}.`
            );
            console.log();
            console.log(`    ${chalk.dim('// ...')}`);
            console.log(`    ${chalk.yellow('"scripts"')}: {`);
            console.log(`      ${chalk.dim('// ...')}`);
            console.log(
                `      ${chalk.yellow('"predeploy"')}: ${chalk.yellow(
                    '"npm run build",'
                )}`
            );
            console.log(
                `      ${chalk.yellow('"deploy"')}: ${chalk.yellow(
                    '"gh-pages -d build"'
                )}`
            );
            console.log('    }');
            console.log();
            console.log('Then run:');
        }
        console.log();
        console.log(`  ${chalk.cyan(useYarn ? 'yarn' : 'npm')} run deploy`);
        console.log();
    } else if (publicPath !== '/') {
        // "homepage": "http://mywebsite.com/project"
        console.log(
            `The project was built assuming it is hosted at ${chalk.green(
                publicPath
            )}.`
        );
        console.log(
            `You can control this with the ${chalk.green(
                'homepage'
            )} field in your ${chalk.cyan('package.json')}.`
        );
        console.log();
        console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
        console.log();
    } else {
        if (publicUrl) {
            // "homepage": "http://mywebsite.com"
            console.log(
                `The project was built assuming it is hosted at ${chalk.green(
                    publicUrl
                )}.`
            );
            console.log(
                `You can control this with the ${chalk.green(
                    'homepage'
                )} field in your ${chalk.cyan('package.json')}.`
            );
            console.log();
        } else {
            // no homepage
            console.log(
                'The project was built assuming it is hosted at the server root.'
            );
            console.log(
                `To override this, specify the ${chalk.green(
                    'homepage'
                )} in your ${chalk.cyan('package.json')}.`
            );
            console.log('For example, add this to build it for GitHub Pages:');
            console.log();
            console.log(
                `  ${chalk.green('"homepage"')} ${chalk.cyan(':')} ${chalk.green(
                    '"http://myname.github.io/myapp"'
                )}${chalk.cyan(',')}`
            );
            console.log();
        }
        console.log(
            `The ${chalk.cyan(buildFolder)} folder has been deployed to Spring Boot`
        );
        console.log('You may serve it Spring Boot:');
        console.log();
    }
}

module.exports = printHostingInstructions;
