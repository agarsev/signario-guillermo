const { ipcRenderer } = require('electron');
const Sqlite = require('better-sqlite3');

let db = null;

exports.getDB = async function () {
    if (db == null) {
        db = Sqlite(await ipcRenderer.invoke('get_db_path'));
    }
    return db;
}
