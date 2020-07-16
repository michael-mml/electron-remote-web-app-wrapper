const isDevelopmentMode = (app) => process.env.ELECTRON_IS_DEV
  ? parseInt(process.env.ELECTRON_IS_DEV, 10) === 1
  : !app.isPackaged;

module.exports = isDevelopmentMode;
