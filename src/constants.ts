// constants for bridging the Electron API to the web app
// TODO: change this to a default export once main.js is converted to TypeScript
export = {
  APP_MESSAGE_TYPE: {
    NEW_MESSAGE_ARRIVED: 'new.message',
    NEW_DATA_MESSAGE_ARRIVED: 'new.data.message',
    RESTORE_APP: 'RESTORE_APP',
  },
  PUSH_NOTIFICATION_TYPE: {
    MESSAGE_REMOVED: 'app.event.message.removed',
  },
};
