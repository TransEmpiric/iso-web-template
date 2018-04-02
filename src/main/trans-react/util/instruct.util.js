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

const url = require('url');
const TransLoggerUtil = require('./trans.logger.util');
const log = new TransLoggerUtil('client.dev.build.js', 'CLIENT');

const indent_4 = "    ";
const msg_hosted_at = "The client app was built assuming it is hosted at ";
const msg_home_page = "You can adjust this using the homepage field in the trans-react/client package.json file. ";

function clientInstructions(
    appPackage,
    publicUrl,
    publicPath
) {
    const publicPathname = url.parse(publicPath).pathname;
    let msg = "\n" + indent_4;
    if (publicUrl && publicUrl.indexOf('.github.io/') !== -1) {
        msg += msg_hosted_at + publicPathname + "'. ";
    } else if (publicPath !== '/') {
        msg += msg_hosted_at +  "'" + publicPath + + "'. ";
    } else {
        if (publicUrl) {
            msg += msg_hosted_at + "'" + publicUrl + "'. ";
        } else {
            msg += "The client app was built assuming it is hosted at the server root. ";
        }
    }

    log.info(msg
        + msg_home_page
        + "The CLIENT app has been built and distributed to the Spring Boot resources directory. ",
        {noSrc: true}
    );
}

function ssrInstructions() {
    log.info("\n" + indent_4 + "The SSR app has been built and distributed to the Spring Boot resources directory. "
        + "Spring Boot is ready to be deployed. "
        + "You may start Spring Boot from the project root directory via gradle: "
        + "\n\n" + indent_4  + "  > " + "./gradlew bootRun\n",
        {noSrc: true}
    );
}

module.exports = {
    clientInstructions: clientInstructions,
    ssrInstructions: ssrInstructions
}