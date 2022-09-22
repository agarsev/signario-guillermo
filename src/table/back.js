const { contextBridge, ipcRenderer } = require('electron');

const { getDB } = require('../common/back.js');

const PAGE_SIZE = 50;

let db, numPages, totalCount, getFinished;

const init = (async function () {
    db = await getDB();
    const res = db.prepare("SELECT COUNT(*) as count FROM signs;").get();
    totalCount = parseInt(res.count);
    numPages = Math.floor(totalCount / PAGE_SIZE)+((totalCount % PAGE_SIZE)?1:0);
    getFinished = db.prepare("SELECT COUNT(*) as count FROM signs WHERE notation IS NOT '';");
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
        const finished = parseInt(getFinished.get().count)
        return { rows, numPages, totalCount, finished };
    },

    setUserName: name => ipcRenderer.invoke('set_user_name', name)

});
