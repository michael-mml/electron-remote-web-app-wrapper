export const isDevelopmentMode = (app: Electron.App) => process.env.ELECTRON_IS_DEV
  ? parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
  : !app.isPackaged;
