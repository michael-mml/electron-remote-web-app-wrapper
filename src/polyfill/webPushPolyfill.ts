import { ipcRenderer } from 'electron';
import log from 'electron-log';
import {
  NOTIFICATION_RECEIVED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_SERVICE_STARTED,
  START_NOTIFICATION_SERVICE,
  TOKEN_UPDATED
} from 'electron-push-receiver/src/constants';
import TYPES from '../constants';

export const webPush = {
  constants: {
    APP_MESSAGE_TYPE: TYPES.APP_MESSAGE_TYPE,
    PUSH_NOTIFICATION_TYPE: TYPES.PUSH_NOTIFICATION_TYPE,
    NOTIFICATION_RECEIVED,
  },
  gcmFcmMessaging: {
    getToken: () => {
      const fn = '[getToken]';
      // TODO: check if dynamic import works
      let FCM_SENDER_ID: string;
      (async function setFCMID() {
        try {
          switch (process.env.NODE_ENV) {
            case 'local': {
              const module = await import('./../../environment/environment.local');
              FCM_SENDER_ID = module.default.FCM_SENDER_ID;
              break;
            }
            case 'prod':
            default: {
              const module = await import('./../../environment/environment.prod');
              FCM_SENDER_ID = module.default.FCM_SENDER_ID;
              break;
            }
          }
          log.info(`${fn} ${FCM_SENDER_ID}`);
        } catch (err) {
          log.error(`${fn} ${err}`);
          throw err;
        }

        return new Promise((resolve, reject) => {
          try {
            // Start service
            ipcRenderer.send(START_NOTIFICATION_SERVICE, FCM_SENDER_ID);

            // Listen for service successfully started
            ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token: unknown) => {
              log.info(`${fn} service successfully started, token: ${token}`);
              resolve(token);
            });

            // Send FCM token to backend
            ipcRenderer.on(TOKEN_UPDATED, (_, token: unknown) => {
              log.info(`${fn} token updated: ${token}`);
              resolve(token);
            });
          } catch (err) {
            // Handle notification errors
            ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, err: unknown) =>
              log.error(`${fn} notification service error: ${err}`)
            );
            reject(err);
          }
        });
      })();
    }
  },
};
