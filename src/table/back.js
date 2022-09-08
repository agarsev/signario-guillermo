const { contextBridge } = require('electron');

const db = require('better-sqlite3')('../data/signario.db', {
    fileMustExist: true,
});

const selectQuery = db.prepare('SELECT * FROM signs LIMIT ?;');

contextBridge.exposeInMainWorld('back', {

    select: function () {
        return selectQuery.all(10);
    }
});
