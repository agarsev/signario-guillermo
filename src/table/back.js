const { contextBridge, ipcRenderer } = require('electron');

const { getDB } = require('../common/back.js');

const PAGE_SIZE = 50;

let db, totalCount, getFinished;

const init = (async function () {
    db = await getDB();
    totalCount = parseInt(db.prepare("SELECT COUNT(*) FROM signs;").pluck().get());
    getFinished = db.prepare("SELECT COUNT(*) FROM signs WHERE notation IS NOT '';").pluck();
})();

function sqlWhere (search) {
    if (!search) return '';
    return `WHERE (notation GLOB '*${search}*') OR (gloss LIKE '%${search}%')`;
}

contextBridge.exposeInMainWorld('back', {

    openDetail: (number, reuse) => ipcRenderer.invoke('open_detail', { number, reuse }),

    select: async function (page, search) {
        await init;
        const order = 'number';
        const asc = true;
        const where = sqlWhere(search);

        const rows = db.prepare(`SELECT signs.*, group_concat(flags.icon, '') AS flag_icons
            FROM signs
            LEFT JOIN signFlags ON signs.number = signFlags.sign
            LEFT JOIN flags ON flags.id = signFlags.flag
            ${where} GROUP BY signs.number
            ORDER BY ${order} ${asc?'ASC':'DESC'}
            LIMIT ${PAGE_SIZE} OFFSET ${page*PAGE_SIZE}
        ;`).all();

        const count = parseInt(db.prepare(`SELECT COUNT(*) FROM signs ${where};`).pluck().get());
        const numPages = Math.floor(count / PAGE_SIZE)+((count % PAGE_SIZE)?1:0);

        const finished = parseInt(getFinished.get())
        return { rows, numPages, totalCount, finished };
    },

    setUserName: name => ipcRenderer.invoke('set_user_name', name)

});
