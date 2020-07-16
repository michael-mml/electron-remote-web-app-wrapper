const {
  Tray
} = require('electron');
const log = require('electron-log');
const path = require('path');
const menuFactory = require('./menu');
const isDevelopmentMode = require('../util/isDevelopmentMode');

class TrayFactory {
  buildTray = (app, window) => {
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
        // TODO: create a tray and test on Linux
        break;
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

class CustomTray {
  contextMenu;
  tray;

  constructor(trayIconPath) {
    this.tray = new Tray(trayIconPath);
  }

  createContextMenu = (app) => {
    this.contextMenu = menuFactory.buildContextMenu(app);
    this.tray.setContextMenu(this.contextMenu.contextMenu);
  }

  static restoreWindow = (window) => {
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

class MacTray extends CustomTray {
  constructor(trayIconPath) {
    super(trayIconPath);
  }
}

class WindowsTray extends CustomTray {
  constructor(trayIconPath, window) {
    super(trayIconPath);
    this.tray.on('click', (event) => CustomTray.restoreWindow(window));
  }
}

module.exports = {
  CustomTray: CustomTray,
  trayFactory: new TrayFactory()
}
