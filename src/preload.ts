// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import {
  contextBridge,
  desktopCapturer,
  ipcRenderer
} from 'electron';
import log from 'electron-log';
import { webPush } from './polyfill/webPushPolyfill';

const ns = '[preload]';

contextBridge.exposeInMainWorld(
  'electron',
  {
    constants: webPush.constants,
    desktopCapturer: async (options: Electron.SourcesOptions) => {
      const fn = '[desktopCapturer]';
      try {
        const sources = await desktopCapturer.getSources(options);

        return sources.map((el: Electron.DesktopCapturerSource) => ({
          ...el,
          thumbnail: el.thumbnail.toDataURL(),
        }));
      } catch (err) {
        log.error(`${ns}${fn} error getting sources: ${err}`);
        throw err;
      }
    },
    gcmFcmMessaging: webPush.gcmFcmMessaging,
    send: (channel: string, data: any[]) => ipcRenderer.send(channel, data),
    receive: (channel: string, callback: Function) => ipcRenderer.on(
      channel,
      (event: Electron.IpcRendererEvent, ...args: any[]) => callback(args)
    ),
  }
);
