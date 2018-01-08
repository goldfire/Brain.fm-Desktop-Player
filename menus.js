const {BrowserView, Menu} = require('electron');

/**
 * Create the application's main menu.
 */
const create = () => {
  const wc = BrowserView.getAllViews()[0].webContents;

  // Define the menu items.
  const menuItems = [
    {
      role: 'editMenu',
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click() {
            wc.reload();
          },
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click() {
            wc.toggleDevTools();
          },
        },
      ],
    },
    {
      role: 'windowMenu',
    },
    {
      label: 'Playback',
      submenu: [
        {
          label: 'Play/Pause',
          accelerator: 'MediaPlayPause',
          click() {
            wc.executeJavaScript(`document.getElementsByClassName('modules-music-player-css-PlayControl__wrapper___2ROhW')[0].click()`);
          },
        },
        {
          label: 'Skip',
          accelerator: 'MediaNextTrack',
          click() {
            wc.executeJavaScript(`document.getElementsByClassName('modules-music-player-css-Skip__skip___iZcPm')[0].click()`);
          },
        },
      ],
    },
  ];

  // Add the macOS first menu with about, services, etc.
  if (process.platform === 'darwin') {
    menuItems.unshift({
      label: 'CasinoRPG',
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ],
    });
  }

  // Build and set the menu.
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuItems));
};

// Export the create method.
module.exports = {create};
