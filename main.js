const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const menus = require('./menus');

const {app, BrowserWindow, BrowserView, globalShortcut} = electron;
let mainWindow;
let mainView;

function createWindow() {
  // Load the previous state with fallback to defaults 
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1023,
    defaultHeight: 767,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'Brain.fm',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    useContentSize: true,
    show: false,
    center: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  // Create the browser view and load Brain.fm.
  mainView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
    },
  });
  mainWindow.setBrowserView(mainView);
  mainView.setBounds({
    x: 0,
    y: 0,
    width: mainWindowState.width,
    height: mainWindowState.height,
  });
  mainView.webContents.loadURL('https://www1.brain.fm/app');

  // Wait until the app loads to show the window.
  mainView.webContents.on('did-finish-load', () => {
    mainWindow.show();

    // Hack to fire resize on the page content to get it showing correctly.
    mainWindow.setSize(mainWindowState.width + 1, mainWindowState.height + 1, false);
  });

  // Resize the browser view when the window resizes.
  mainWindow.on('resize', () => {
    const {x, y, width, height} = mainWindow.getContentBounds();
    mainView.setBounds({x: 0, y: 0, width, height: height});
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create the main menu.
  menus.create();

  // Auto-update the window state.
  mainWindowState.manage(mainWindow);

  // Create global shortcuts for skip and play/pause.
  globalShortcut.register('MediaPlayPause', () => {
    mainView.webContents.executeJavaScript(`document.getElementsByClassName('modules-music-player-css-PlayControl__wrapper___2ROhW')[0].click()`);
  });
  globalShortcut.register('MediaNextTrack', () => {
    mainView.webContents.executeJavaScript(`document.getElementsByClassName('modules-music-player-css-Skip__skip___iZcPm')[0].click()`);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
