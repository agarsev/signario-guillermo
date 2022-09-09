const { contextBridge, ipcRenderer } = require('electron');

const db = require('better-sqlite3')('../data/signario.db', {
    fileMustExist: true,
});

const PAGE_SIZE = 50;
function numberOfPages() {
    const res = db.prepare("SELECT COUNT(*) as count FROM signs;").get();
    const count = parseInt(res.count);
    return Math.floor(count / PAGE_SIZE)+((count % PAGE_SIZE)?1:0);
}
let numPages = numberOfPages();

contextBridge.exposeInMainWorld('back', {

    openDetail: number => ipcRenderer.invoke('open_detail', number),

    select: function (page) {
        const order = 'number';
        const asc = true;
        const rows = db.prepare(`SELECT *
            FROM signs ORDER BY ${order} ${asc?'ASC':'DESC'}
            LIMIT ${PAGE_SIZE} OFFSET ${page*PAGE_SIZE}
        ;`).all();
        return { rows, numPages };
    }

});
