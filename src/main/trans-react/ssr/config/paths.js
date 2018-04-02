'use strict';

const path = require('path');

const TransLoggerUtil = require('../../util/trans.logger.util');

const log = new TransLoggerUtil('react.client.env.js', 'CLIENT');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const resolveAppPath = relativePath => {
    let appPath = path.resolve(__dirname, relativePath);
    log.debug("Found appPath:  " + appPath);
    return appPath;
};

module.exports = {
    appBuild: resolveAppPath('../../build'),
    appBuildJs: resolveAppPath('../../build/static/js/ssr'),
    appBuildManifest: resolveAppPath('../../build/static/asset-manifest.json'),
    appBuildRenderer: resolveAppPath('../../build/static/js/ssr/ssr.js'),
    appDist: resolveAppPath('../../../resources/static'),
    appDistJs: resolveAppPath('../../../resources/static/js/ssr'),
    appDistRenderer: resolveAppPath('../../../resources/static/js/ssr/ssr.js'),
    appPolyfill: resolveAppPath('./polyfill.js'),
    appNodeModules: resolveAppPath('../node_modules'),
    appSrc: resolveAppPath('../src'),
    appSrcSSR: resolveAppPath('../src/ssr.js'),
    dotenv: resolveAppPath('.env'),
};