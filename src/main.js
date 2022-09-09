const { app, BrowserWindow, Menu, ipcMain } = require('electron');
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
  win.on('closed', () => app.quit());
}

app.whenReady()
  .then(MainWindow);

function DetailWindow () {
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
    return new BrowserWindow({
        webPreferences: {
            spellcheck: false,
            preload: path.join(__dirname, 'detail/back.js'),
        },
    });
}

let detail_window = null;
ipcMain.handle('open_detail', number => {
    if (!detail_window) {
        detail_window = DetailWindow();
    }
    detail_window.loadFile('dist/detail/index.html');
});
