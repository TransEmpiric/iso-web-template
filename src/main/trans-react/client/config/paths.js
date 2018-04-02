'use strict';

const path = require('path');
const url = require('url');

const TransLoggerUtil = require('../../util/trans.logger.util');

const log = new TransLoggerUtil('env.js', 'CLIENT');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const resolveAppPath = relativePath => {
    let appPath = path.resolve(__dirname, relativePath);
    log.debug("Found appPath:  " + appPath);
    return appPath;
};

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

module.exports = {
    appBuild: resolveAppPath('../../build'),
    appBuildStatic: resolveAppPath('../../build/static'),
    appBuildStaticCss: resolveAppPath('../../build/static/css/trans-react'),
    appBuildStaticJs: resolveAppPath('../../build/static/js/client'),
    appBuildStaticJsManifest: resolveAppPath('../../build/static/asset-manifest.json'),
    appBuildStaticPublic: resolveAppPath('../../build/static/public'),
    appDist: resolveAppPath('../../../resources/static'),
    appDistCss: resolveAppPath('../../../resources/static/css/trans-react'),
    appDistJs: resolveAppPath('../../../resources/static/js/client'),
    appDistJsManifest: resolveAppPath('../../../resources/static/asset-manifest.json'),
    appDistPublic: resolveAppPath('../../../resources/static/public'),
    appNodeModules: resolveAppPath('../node_modules'),
    appPackageJson: resolveAppPath('../package.json'),
    appPolyfill: resolveAppPath('./polyfill.js'),
    appPublic: resolveAppPath('../public'),
    appPublicTemplate: resolveAppPath('../public/template'),
    appPublicTemplateIndex: resolveAppPath('../public/template/index.html'),
    appSrc: resolveAppPath('../src'),
    appSrcJsIndex: resolveAppPath('../src/index.js'),
    dotenv: resolveAppPath('.env'),
    publicUrl: getPublicUrl(resolveAppPath('../package.json')),
    servedPath: getServedPath(resolveAppPath('../package.json'))
};