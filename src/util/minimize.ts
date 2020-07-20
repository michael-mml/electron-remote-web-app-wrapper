export const minimizeToBackground = (
  event: Electron.Event,
  window: Electron.BrowserWindow,
  isAppQuitting: boolean,
) => {
  if (isAppQuitting) {
    return;
  }
  // if the user closes the window (and doesn't quit the app), keep the app
  // running in the background
  event.preventDefault();
  if (window.isFullScreen()) { // to minimize a macOS fullscreen window
    window.once('leave-full-screen', () => window.hide());
    window.setFullScreen(false);
  } else {
    window.hide();
  }
}
