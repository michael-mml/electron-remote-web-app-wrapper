const { execFile: eF } = require('child_process');
const {
  systemPreferences
} = require('electron');
const log = require('electron-log');
const util = require('util');
const execFile = util.promisify(eF);

const ns = '[screenSharePermissions]';

// macOS only
// On new installs of the app, the screen share permission remains ticked, but
// is not granted
// To resolve this: reset the permission via command line, which unticks the permission
export const resetScreenSharePermissions = () => {
  const fn = '[resetScreenSharePermissions]';
  switch (systemPreferences.getMediaAccessStatus('screen')) {
    // TODO: send message to remote-web-app that screen sharing screen permissions are missing
    case "denied":
    case "not-determined":
    case "restricted": {
      (async (execFile) => {
        try {
          // reset ScreenCapture permissions
          const { stdout, stderr } = await execFile(
            'tccutil',
            [
              'reset',
              'ScreenCapture',
              'com.electron.remote.wrapper'
            ],
          );
          log.info(`${ns}${fn} stdout: ${stdout}, stderr: ${stderr}`);
        } catch (err) {
          log.error(`${ns}${fn} permissions error: ${err}`);
        }
      })(execFile);
      break;
    }
    case "granted": {
      log.info(`${ns}${fn} permission granted`);
      break;
    }
    case "unknown":
    default: {
      log.error(`${ns}${fn} something went wrong`);
    }
  }
};
