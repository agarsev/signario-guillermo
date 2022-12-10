const { app, ipcRenderer } = require('electron');
const Sqlite = require('better-sqlite3');
const path = require('path');

exports.getDB = async function () {
    return Sqlite(await ipcRenderer.invoke('get_db_path'));
}

exports.mainGetDB = function () {
    return Sqlite(path.join(app.getPath('userData'), 'signario.db'));
}

exports.initDB = function () {
    const db = exports.mainGetDB();
    db.pragma("foreign_keys = ON");
    const version = db.pragma("user_version", {simple:true});

    if (version<1 && !db.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='flags'").pluck().get()) {
        createFlags(db);
    }
    if (version<1) createMerge(db);

    if (version<2) createAttachments(db);

    db.pragma("user_version = 2");
}

function createFlags(db) {
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

function createMerge(db) {
    db.exec(`CREATE TABLE config (
        key TEXT NOT NULL UNIQUE,
        value TEXT
    );`);
    db.prepare("INSERT INTO config(key, value) VALUES (?, ?)").run("last_merge", "2022-09-03");
}

function createAttachments(db) {
    db.exec(`CREATE TABLE attachments (
        sign INTEGER NOT NULL REFERENCES signs(number),
        id INTEGER NOT NULL,
        type TEXT NOT NULL,
        content BLOB,
        PRIMARY KEY(sign, id)
    );`);
}
