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
    label: 'Exportar BD',
    click: exportDB
  }, {
    label: 'Importar BD',
    click: importDB
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
  main_window.on('closed', () => app.quit());
  reload_main();
});
function reload_main () {
  main_window.loadFile('dist/table/index.html', {
    query: {
      user_name: prefs['user_name']
    }
  });
}

let detail_windows = [];
function loadDetail ({ win, number }) {
  win.loadFile('dist/detail/index.html', {
    query: {
      number,
      user_name: prefs['user_name'],
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
    detail_windows.push({win});
  }
  const w = detail_windows[detail_windows.length-1];
  w.number = number;
  loadDetail(w);
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

const db_path = path.join(app.getPath('userData'), 'signario.db');
ipcMain.handle('get_db_path', () => db_path);

async function exportDB (_, win) {
  const res = await dialog.showSaveDialog(win, {
    title: "Exportar base de datos",
  });
  if (res.canceled) return;
  fs.copyFile(db_path, res.filePath, () => {
    dialog.showMessageBox(win, {
      title: "Éxito",
      type: "info",
      message: "Base de datos exportada con éxito.",
    });
  });
}
async function importDB (_, win) {
  await dialog.showMessageBox(win, {
    title: "Atención",
    type: "warning",
    message: "Al importar una base de datos, se perderán los cambios sin sincronizar.",
  });
  const res = await dialog.showOpenDialog(win, {
    title: "Importar base de datos",
    properties: ['openFile']
  });
  if (res.canceled) return;
  detail_windows.forEach(({win}) => win.close());
  fs.copyFile(res.filePaths[0], db_path, reload_main);
}

ipcMain.handle('set_user_name', (_, name) => {
    prefs.set('user_name', name);
    detail_windows.forEach(loadDetail);
    reload_main();
});
