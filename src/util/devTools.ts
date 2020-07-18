import log from 'electron-log';
import { isDevelopmentMode } from './isDevelopmentMode';

const ns = '[devTools]';

export const installDevTools = async (app: Electron.App) => {
  const fn = '[install]';
  // Since electron-devtools-installer is a devDependency, it is not included when the app is packaged
  // Related issue: https://github.com/alexdevero/electron-react-webpack-boilerplate/issues/16
  if (isDevelopmentMode(app)) {
    const module = await import('electron-devtools-installer');
    const installExtension = module.default;
    try {
      const name = await installExtension([module.VUEJS_DEVTOOLS]);
      log.info(`${ns}${fn} Added extension: ${name}`);
    } catch (err) {
      log.error(`${ns}${fn} Failed to install extension: ${name}`);
    }
  }
};
