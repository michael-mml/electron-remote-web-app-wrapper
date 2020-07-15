import { CustomContextMenu } from "./menu";

const {
  Tray
} = require('electron');
const log = require('electron-log');
const path = require('path');
const { menuFactory } = require('./menu');
const { isDevelopmentMode } = require('../util/isDevelopmentMode');

class TrayFactory {
  buildTray = (app: Electron.App, window: Electron.BrowserWindow) => {
    const fn = '[buildTray]';
    // .png tray icons cannot use @2x in the name to avoid minimize size error
    const trayIconPath = isDevelopmentMode(app)
      ? process.platform === 'win32'
        ? path.join(__dirname, '..', '..', 'build', 'icons', 'white-atom.ico')
        : path.join(__dirname, '..', '..', 'build', 'icons', 'white-atom-tray.png')
      : process.platform === 'win32'
        ? path.join(__dirname, '..', '..', 'build', 'icons', 'green-atom.ico')
        : path.join(__dirname, '..', '..', 'build', 'icons', 'green-atom-tray.png');
    switch (process.platform) {
      case 'darwin': {
        return new MacTray(trayIconPath);
      }
      case 'linux': {
        // TODO: test on Linux
        return new LinuxTray(trayIconPath);
      }
      case 'win32': {
        return new WindowsTray(trayIconPath, window);
      }
      default: {
        log.info(`${fn} unknown platform`);
        break;
      }
    }
  };
}

export class CustomTray {
  contextMenu!: CustomContextMenu;
  tray: Electron.Tray;

  constructor(trayIconPath: string) {
    this.tray = new Tray(trayIconPath);
  }

  createContextMenu = (app: Electron.App) => {
    this.contextMenu = menuFactory.buildContextMenu(app);
    this.tray.setContextMenu(this.contextMenu.contextMenu);
  }

  static restoreWindow = (window: Electron.BrowserWindow) => {
    if (window.isMinimized()) { // window minimized via _
      window.restore();
      window.focus();
    } else if (!window.isVisible()) { // window hidden via X
      window.show();
    } else if (!window.isFocused()) { // if push notification is clicked and window is not in the foreground
      window.focus();
    }
  }
}

class LinuxTray extends CustomTray {
  constructor(trayIconPath: string) {
    super(trayIconPath);
  }
}

class MacTray extends CustomTray {
  constructor(trayIconPath: string) {
    super(trayIconPath);
  }
}

class WindowsTray extends CustomTray {
  constructor(trayIconPath: string, window: Electron.BrowserWindow) {
    super(trayIconPath);
    this.tray.on('click', (event: Electron.KeyboardEvent) => CustomTray.restoreWindow(window));
  }
}

export const trayFactory = new TrayFactory();
