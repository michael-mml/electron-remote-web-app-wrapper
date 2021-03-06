import { Menu } from 'electron';
import log from 'electron-log';

class MenuFactory {
  buildContextMenu = (app: Electron.App) => {
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
        throw new Error(`${fn} Did not match a platform`);
      }
    }
  };
}

export class CustomContextMenu {
  contextMenu: Menu;

  constructor(
    menuItems: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[]
  ) {
    this.contextMenu = Menu.buildFromTemplate(menuItems);
  }
}

class MacContextMenu extends CustomContextMenu {
  constructor(app: Electron.App) {
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
  constructor(app: Electron.App) {
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
  constructor(app: Electron.App) {
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

export const menuFactory = new MenuFactory();
