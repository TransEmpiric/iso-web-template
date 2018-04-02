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

const fs = require('fs');
const path = require('path');
const join = require('path').join;
const cp = require('child_process');

const transReactRootDir = fs.realpathSync(process.cwd());
const resolveDir = relativePath => path.resolve(transReactRootDir, relativePath);
const modules = [
        {name: "CLIENT", dir: resolveDir('./client')},
        {name: "SSR", dir: resolveDir('./ssr')}
    ];
console.log('#### Running "preinstall" for ALL trans-react modules.');

if (!fs.existsSync(join(transReactRootDir, 'package.json'))) {
    console.error('#### ERROR: "package.json" NOT found for trans-react ROOT module.');
    console.error('#### trans-react ROOT directory:' +
        '\n     > ' + transReactRootDir + '\n');
    process.exit(1);
} else {
    console.log('#### Found "package.json" in trans-react ROOT directory:' +
        '\n     > ' + transReactRootDir);
}

modules
    .forEach(function (module) {
        /* Ensure module has a package.json */
        if (!fs.existsSync(join(module.dir, 'package.json'))) {
            console.error('#### ERROR: "package.json" NOT found in trans-react ' + module.name + ' directory.');
            console.error('#### trans-react ' + module.name + ' directory:' +
                '\n     > ' + module.dir + '\n');
        } else {
            console.log('#### Found "package.json" in trans-react ' + module.name + ' directory:' +
                '\n     > ' + module.dir);

            /* Do npm install */
            cp.spawn('npm', ['install'], { env: process.env, cwd: module.dir, stdio: 'inherit' });
        }
    });

console.log('\n');