const {
  Menu,
} = require('electron');
const log = require('electron-log');

class MenuFactory {
  buildContextMenu = (app) => {
    const fn = '[buildContextMenu]';
    switch (process.platform) {
      case 'darwin': {
        return new MacContextMenu(app);
      }
      case 'linux': {
        return new LinuxContextMenu(app);
      }
      case 'win32': {
        return new WindowsContextMenu(app);
      }
      default: {
        log.info(`${fn} unknown platform`);
        break;
      }
    }
  };
}

class CustomContextMenu {
  contextMenu;

  constructor(menuItems) {
    this.contextMenu = Menu.buildFromTemplate(menuItems);
  }
}

class MacContextMenu extends CustomContextMenu {
  constructor(app) {
    super(
      [
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          // TODO: remove the click handler and use role: 'button' once https://github.com/electron/electron/issues/9966 is resolved
          click: () => {
            const fn = '[click]';
            log.log(`${fn} Quitting application`);
            app.quit(); // emits the before-quit event first and then the close event
          }
        },
      ]
    );
  }
}

class LinuxContextMenu extends CustomContextMenu {
  constructor(app) {
    super(
      [
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          // TODO: remove the click handler and use role: 'button' once https://github.com/electron/electron/issues/9966 is resolved
          click: () => {
            const fn = '[click]';
            log.log(`${fn} Quitting application`);
            app.quit(); // emits the before-quit event first and then the close event
          }
        },
      ]
    );
  }
}

class WindowsContextMenu extends CustomContextMenu {
  constructor(app) {
    super(
      [
        {
          label: 'item1',
          click: () => {
            log.log('clicked item1');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          // TODO: remove the click handler and use role: 'button' once https://github.com/electron/electron/issues/9966 is resolved
          click: () => {
            const fn = '[click]';
            log.log(`${fn} Quitting application`);
            app.quit(); // emits the before-quit event and close event (in that order?)
          }
        },
      ]
    );
  }
}

module.exports = new MenuFactory();
