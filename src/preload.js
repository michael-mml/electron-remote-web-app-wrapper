// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {
  contextBridge,
  desktopCapturer,
  ipcRenderer
} = require('electron');
const log = require('electron-log');
const webPush = require('./polyfill/webPushPolyfill');

const ns = '[preload]';

contextBridge.exposeInMainWorld(
  'electron',
  {
    constants: webPush.constants,
    desktopCapturer: async (options) => {
      const fn = '[desktopCapturer]';
      try {
        const sources = await desktopCapturer.getSources(options);

        return sources.map(el => ({
          ...el,
          thumbnail: el.thumbnail.toDataURL(),
        }));
      } catch (err) {
        log.error(`${ns}${fn} error getting sources: ${err}`);
        throw err;
      }
    },
    gcmFcmMessaging: webPush.gcmFcmMessaging,
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, callback) => ipcRenderer.on(
      channel,
      (event, ...args) => callback(args)
    ),
  }
);
