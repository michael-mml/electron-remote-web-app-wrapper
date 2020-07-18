# Electron Remote Web App Wrapper

This is a minimal Electron application that renders an existing, deployed web app.

A basic Electron wrapper needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
    - NOTE: The [`productName`](https://www.electronjs.org/docs/api/app#appgetname) field is used to support special characters in the app's name for macOS
- `main.js` - Starts the app and loads the URL of the web app. This is the app's **main process**, but the web app is the **renderer process**.

## Getting Started

To clone and run this repository you'll need [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)), and [Yarn](https://classic.yarnpkg.com/en/docs/install) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/michael-mml/electron-remote-web-app-wrapper
# Go into the repository
cd electron-remote-web-app-wrapper
# Install dependencies
yarn install
# Run the app
yarn start
```

If using VSCode, use the `Electron Remote Web App Wrapper` debug configuration to automatically build and launch the Electron app, while watching for changes in `.ts` files and recompiling.

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Known Issues

Due to Electron's [high resolution image auto scaling](https://www.electronjs.org/docs/api/native-image#high-resolution-image) and `electron-builder`'s minimize image size requirements, `.png` tray icons cannot have `@2x` in the name. 

## Testing

In the Chromium console, run `await window.electron.desktopCapturer({ types: ['window', 'screen']});` to see the list of sources received.

## License

[GNU GPL 3.0](LICENSE)

## Credits

Icon made by [Good Ware](https://www.flaticon.com/authors/good-ware) from [www.flaticon.com](www.flaticon.com)
