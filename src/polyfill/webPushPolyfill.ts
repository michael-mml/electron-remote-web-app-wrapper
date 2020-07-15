const {
  ipcRenderer
} = require('electron');
const log = require('electron-log');
const {
  NOTIFICATION_RECEIVED, NOTIFICATION_SERVICE_ERROR, NOTIFICATION_SERVICE_STARTED, START_NOTIFICATION_SERVICE,
  TOKEN_UPDATED
} = require('electron-push-receiver/src/constants');
const {
  APP_MESSAGE_TYPE,
  PUSH_NOTIFICATION_TYPE
} = require('../constants');

// TODO: double check the sender ID once we have a valid FCM token
let FCM_SENDER_ID: string;
switch (process.env.BUILD) {
  case 'local': {
    FCM_SENDER_ID = require('./../../environment/environment.local.js');
    break;
  }
  case 'prod':
  default: {
    FCM_SENDER_ID = require('./../../environment/environment.prod.js');
    break;
  }
}

export const webPush = {
  constants: {
    APP_MESSAGE_TYPE,
    PUSH_NOTIFICATION_TYPE,
    NOTIFICATION_RECEIVED
  },
  gcmFcmMessaging: {
    getToken: () => {
      const fn = '[getToken]';
      return new Promise((resolve, reject) => {
        try {
          // Start service
          ipcRenderer.send(START_NOTIFICATION_SERVICE, FCM_SENDER_ID);

          // Listen for service successfully started
          ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_: unknown, token: unknown) => {
            log.info(`${fn} service successfully started, token: ${token}`);
            resolve(token);
          });

          // Send FCM token to backend
          ipcRenderer.on(TOKEN_UPDATED, (_: unknown, token: unknown) => {
            log.info(`${fn} token updated: ${token}`);
            resolve(token);
          });
        } catch (err) {
          // Handle notification errors
          ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_: unknown, err: unknown) =>
            log.error(`${fn} notification service error: ${err}`)
          );
          reject(err);
        }
      });
    }
  },
};
