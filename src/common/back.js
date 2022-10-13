const { ipcRenderer } = require('electron');
const Sqlite = require('better-sqlite3');

let db = null;

exports.getDB = async function () {
    if (db == null) {
        db = Sqlite(await ipcRenderer.invoke('get_db_path'));
    }
    initDB();
    return db;
}

function initDB () {
    db.pragma("foreign_keys = ON");

    // Flags
    if (!db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='flags'")
        .pluck().get()) {
        db.exec(`CREATE TABLE flags (
            id INTEGER PRIMARY KEY,
            icon TEXT NOT NULL,
            name TEXT NOT NULL
        );
        CREATE TABLE signFlags (
            sign INTEGER NOT NULL REFERENCES signs(number),
            flag INTEGER NOT NULL REFERENCES flags(id) ON DELETE CASCADE,
            PRIMARY KEY(sign, flag)
        );`);
        const ins = db.prepare("INSERT INTO flags (icon, name) VALUES (?, ?)");
        ins.run("✔\uFE0F", "OK");
        ins.run("⚠\uFE0F", "atención");
        ins.run("⛔\uFE0F", "problema");
    }

}
