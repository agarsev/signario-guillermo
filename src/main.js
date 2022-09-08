const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function MainWindow (dir) {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    role: 'fileMenu',
    submenu: [{
      type: 'separator'
    }, {
      role: 'quit'
    }]
  },{
    role: 'editMenu',
    submenu: [{
      type: 'separator'
    }, {
      role: 'cut',
    }, {
      role: 'copy',
    }, {
      role: 'paste',
    }]
  },{
    role: 'window',
    submenu: [{
      role: 'reload',
    }, {
      role: 'forceReload',
    }, {
      type: 'separator'
    }, {
      role: 'toggleDevTools',
    }]
  }]));
  const win = new BrowserWindow({
    webPreferences: {
      spellcheck: false,
      preload: path.join(__dirname, 'table/back.js'),
    },
  });
  win.loadFile('dist/table/index.html');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
  .then(MainWindow);
