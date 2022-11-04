const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');

const do_merge_db = require('./merge_db.js');
const { initDB } = require('./common/back.js');

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
    label: 'Mezclar BD',
    click: mergeDB
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
  role: 'windowMenu',
  submenu: [{
    role: 'reload',
  }, {
    role: 'forceReload',
  }, {
    type: 'separator'
  }, {
    role: 'toggleDevTools',
  }]
}, {
  role: 'help',
  submenu: [{
    label: 'Manual',
    click: async () => shell.openExternal("https://github.com/agarsev/signario-guillermo/wiki")
  }, {
    label: 'Acerca de Guillermo',
    click: async (_, win) => dialog.showMessageBox(win, {
      title: "Guillermo",
      type: "info",
      message: `\nGuillermo v${app.getVersion()}\n© Signario 2022\nContacto: afgs@ucm.es`
    })
  }]
}]));


let main_window = null;
app.whenReady().then(() => {
  initDB();
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
ipcMain.handle('open_detail', (e, { number, reuse }) => {
  let w;
  if (detail_windows.length == 0 || !reuse) {
    const win = new BrowserWindow({
      webPreferences: {
        spellcheck: false,
        preload: path.join(__dirname, 'detail/back.js'),
      },
    });
    win.on('closed', () => { detail_windows = detail_windows.filter(w => w.win!==win); });
    w = {win};
    detail_windows.push(w);
  } else {
    w = detail_windows.find(w => w.win.id == e.sender.id);
    if (!w) w = detail_windows[detail_windows.length-1];
  }
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

async function mergeDB (_, win) {
  const res = await dialog.showOpenDialog(win, {
    title: "Mezclar base de datos",
    properties: ['openFile']
  });
  if (res.canceled) return;

  let aborter = new AbortController();
  const msg = dialog.showMessageBox(win, {
    signal: aborter.signal,
    title: "Mezclando base de datos",
    message: "Mezclando cambios de las bases de datos... por favor espera.",
  });
  detail_windows.forEach(({win}) => win.close());

  const [conflicts, report_path] = await do_merge_db(res.filePaths[0]);
  aborter.abort();
  await new Promise(resolve => setTimeout(resolve, 0));

  if (conflicts > 0) {
    const msg = dialog.showMessageBox(win, {
      title: "Mezclando base de datos",
      message: `Ha habido ${conflicts} conflictos. Ver informe completo en ${report_path}.`,
    });
  }

  reload_main();
}

