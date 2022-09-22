const { contextBridge, ipcRenderer } = require('electron');

const { getDB } = require('../common/back.js');

const PAGE_SIZE = 50;

let db, numPages;

const init = (async function () {
    db = await getDB();
    const res = db.prepare("SELECT COUNT(*) as count FROM signs;").get();
    const count = parseInt(res.count);
    numPages = Math.floor(count / PAGE_SIZE)+((count % PAGE_SIZE)?1:0);
})();

contextBridge.exposeInMainWorld('back', {

    openDetail: (number, reuse) => ipcRenderer.invoke('open_detail', { number, reuse }),

    select: async function (page) {
        await init;
        const order = 'number';
        const asc = true;
        const rows = db.prepare(`SELECT *
            FROM signs ORDER BY ${order} ${asc?'ASC':'DESC'}
            LIMIT ${PAGE_SIZE} OFFSET ${page*PAGE_SIZE}
        ;`).all();
        return { rows, numPages };
    },

    setUserName: name => ipcRenderer.invoke('set_user_name', name)

});
