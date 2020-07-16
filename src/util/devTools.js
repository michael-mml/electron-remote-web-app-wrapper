const log = require('electron-log');
const isDevelopmentMode = require('./isDevelopmentMode');

const ns = '[devTools]';

// electron-devtools-installer issue: https://github.com/alexdevero/electron-react-webpack-boilerplate/issues/16
const installDevTools = async (app) => {
  const fn = '[install]';
  if (isDevelopmentMode(app)) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer');
    try {
      const name = await installExtension([VUEJS_DEVTOOLS]);
      log.info(`${ns}${fn} Added extension: ${name}`);
    } catch (err) {
      log.error(`${ns}${fn} Failed to install extension: ${name}`);
    }
  }
};

module.exports = installDevTools;
