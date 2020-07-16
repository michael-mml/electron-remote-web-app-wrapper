/**
 * When the user closes the window, keep the app running in the background.
 * @param {Electron.Event} event
 * @param {BrowserWindow} window
 * @param {boolean} isAppQuitting
 */
minimizeToBackground = (event, window, isAppQuitting) => {
  if (isAppQuitting) {
    return;
  }
  event.preventDefault();
  if (window.isFullScreen()) { // to minimize a macOS fullscreen window
    window.once('leave-full-screen', () => window.hide());
    window.setFullScreen(false);
  } else {
    window.hide();
  }
}

module.exports = minimizeToBackground;
