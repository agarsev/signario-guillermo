const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const prefs_path = path.join(app.getPath('userData'), "preferencias.json");
let prefs = {}
try {
  prefs = JSON.parse(fs.readFileSync(prefs_path));
} catch (err) {}
prefs.set = (key, val) => {
  prefs[key] = val;
  fs.writeFileSync(prefs_path, JSON.stringify(prefs));
}

Menu.setApplicationMenu(Menu.buildFromTemplate([{
  role: 'fileMenu',
  submenu: [{
    label: 'Carpeta de vídeos',
    click: setVideoDir
  }, {
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


let main_window = null;
app.whenReady().then(() => {
  main_window = new BrowserWindow({
    webPreferences: {
      spellcheck: false,
      preload: path.join(__dirname, 'table/back.js'),
    },
  });
  main_window.loadFile('dist/table/index.html');
  main_window.on('closed', () => app.quit());
});


let detail_windows = [];
function loadDetail ({ win, number }) {
  win.loadFile('dist/detail/index.html', {
    query: {
      number,
      video_dir: prefs['video_dir'],
    }
  });
}
ipcMain.handle('open_detail', (_, { number, reuse }) => {
  if (detail_windows.length == 0 || !reuse) {
    const win = new BrowserWindow({
      webPreferences: {
        spellcheck: false,
        preload: path.join(__dirname, 'detail/back.js'),
      },
    });
    win.on('closed', () => { detail_windows = detail_windows.filter(w => w.win!==win); });
    detail_windows.push({win,number});
  }
  loadDetail(detail_windows[detail_windows.length-1]);
});

async function setVideoDir (_, win) {
  const res = await dialog.showOpenDialog(win, {
    title: "Seleccionar carpeta de vídeos",
    properties: ['openDirectory'],
  });
  if (!res.canceled) {
    prefs.set('video_dir', res.filePaths[0]);
    detail_windows.forEach(loadDetail);
  }
}
