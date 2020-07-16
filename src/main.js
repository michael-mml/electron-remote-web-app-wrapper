const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
} = require('electron');
const log = require('electron-log');
const {
  setup: setupPushReceiver
} = require('electron-push-receiver');
const path = require('path');
const {
  CustomTray,
  trayFactory
} = require('./service/tray');
const installDevTools = require('./util/devTools');
const isDevelopmentMode = require('./util/isDevelopmentMode');
const minimizeToBackground = require('./util/minimize');
const resetScreenSharePermissions = require('./util/screenSharePermissions');

const {
  APP_MESSAGE_TYPE,
} = require('./types');

let mainWindow;
let customTray;
let isAppQuitting;

// returns true if first instance
// returns false if second instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  const createWindow = (app) => {
    const fn = '[createWindow]';
    const { width, height } = screen.getPrimaryDisplay().workAreaSize; // get usable screen size

    mainWindow = new BrowserWindow({
      backgroundColor: '#fff',
      // setting the maximum size causes macOS to believe it is in a "maximized"
      // state, even though it is not, resulting in double clicking the title bar
      // causing the app to zoom
      width: Math.round(width * 0.95),
      height: Math.round(height * 0.95),
      webPreferences: {
        // TODO: remove always return true
        devTools: isDevelopmentMode(app) ? true : true,
        preload: path.join(__dirname, 'preload.js'),
        // security options from: https://github.com/reZach/secure-electron-template
        nodeIntegration: false, // false prevents renderer.js/remote-web-app from using node
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        contextIsolation: true,
        enableRemoteModule: false,
      },
      icon: isDevelopmentMode(app)
        ? process.platform === 'win32'
          ? path.join(__dirname, '..', 'build', 'icons', 'white-atom.ico')
          : path.join(__dirname, '..', 'build', 'icons', 'white-atom-512x512.png')
        : process.platform === 'win32'
          ? path.join(__dirname, '..', 'build', 'icons', 'green-atom.ico')
          : path.join(__dirname, '..', 'build', 'icons', 'green-atom-512x512.png'),
      title: 'Electron Remote Web App Wrapper'
    });

    // add polyfills
    mainWindow.webContents.session.setPreloads(
      [
        path.join(__dirname, 'polyfill', 'webPushPolyfill.js'),
      ]
    );

    // point to the appropriate environment
    let remoteUrl;
    switch (process.env.BUILD) {
      case 'local': {
        remoteUrl = 'https://localhost:8080';
        break;
      }
      case 'prod':
      default: {
        remoteUrl = 'https://michael-mml.gitlab.io/pogo-raid-map-presentation';
        break;
      }
    }
    mainWindow.loadURL(remoteUrl);

    setupPushReceiver(mainWindow.webContents);

    // Open the DevTools.
    isDevelopmentMode(app)
      ? mainWindow.webContents.openDevTools()
      // TODO: remove menu bar in production
      // Menu.setApplicationMenu(null);
      // DEBUG: remove devtools in production
      : mainWindow.webContents.openDevTools();

    // TODO: refactor this to beforeunload once https://github.com/electron/electron/issues/9966 is resolved
    mainWindow.on(
      'close',
      (event) => minimizeToBackground(
        event,
        mainWindow,
        isAppQuitting,
      )
    );
    // Emitted when the window is closed.
    mainWindow.on('closed', () =>
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    );
  };

  (async function start(app) {
    await app.whenReady();
    installDevTools(app);
    createWindow(app);
    customTray = trayFactory.buildTray(app, mainWindow);
    customTray.createContextMenu(app);
    switch (process.platform) {
      case 'darwin': {
        // only show dock on macOS
        app.dock.setMenu(customTray.contextMenu.contextMenu);
        resetScreenSharePermissions();
        break;
      }
      case 'linux': {
        break;
      }
      case 'win32': {
        // only show tray on Windows platforms
        customTray.tray.setToolTip(`This is a tooltip!`);
        break;
      }
      default:
        break;
    }
  })(app);

  // sets notification's app name: https://www.electronjs.org/docs/tutorial/notifications#windows
  // this should match appId in electron-builder.yml
  app.setAppUserModelId('com.electron.remote.wrapper');

  // TODO: remove if single instance is not required
  // Someone tried to run a second instance, we should focus our window
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      CustomTray.restoreWindow(mainWindow);
    }
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    switch (process.platform) {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      case 'darwin': {
        break;
      }
      default: {
        app.quit();
        break;
      }
    }
  });

  // On macOS, if the user quits by right-clicking the dock icon, then the
  // before-quit event is emitted
  // If the user clicks the red X icon, this event is NOT emitted
  app.on('before-quit', () => isAppQuitting = true);

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(app);
    }
    // On macOS, clicking the dock icon should restore the window; dock behaves similar to tray
    CustomTray.restoreWindow(mainWindow);
  });

  // If certificate is not found
  app.on('certificate-error', function (event, webContents, url, error,
    certificate, callback) {
    event.preventDefault();
    callback(true);
  });

  // When we receive an event from ipcRenderer
  ipcMain.on(APP_MESSAGE_TYPE.RESTORE_APP, () => {
    CustomTray.restoreWindow(mainWindow);
  });
}
