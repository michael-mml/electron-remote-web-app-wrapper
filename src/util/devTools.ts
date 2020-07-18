import log from 'electron-log';
import { isDevelopmentMode } from './isDevelopmentMode';

const ns = '[devTools]';

// electron-devtools-installer issue: https://github.com/alexdevero/electron-react-webpack-boilerplate/issues/16
export const installDevTools = async (app: Electron.App) => {
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
