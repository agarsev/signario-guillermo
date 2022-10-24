const { contextBridge, ipcRenderer } = require('electron');

const { getDB } = require('../common/back.js');

let db, totalCount, sql = {};

const init = (async function () {
    db = await getDB();
    totalCount = parseInt(db.prepare("SELECT COUNT(*) FROM signs;").pluck().get());
    sql.finished = db.prepare("SELECT COUNT(*) FROM signs WHERE notation IS NOT '';").pluck();
    sql.flags = db.prepare("SELECT * FROM flags");
})();

contextBridge.exposeInMainWorld('back', {

    openDetail: (number, reuse) => ipcRenderer.invoke('open_detail', { number, reuse }),
    setUserName: name => ipcRenderer.invoke('set_user_name', name),

    select: async function (search) {
        await init;
        const order = 'number';
        const asc = true;

        let where = '', signFlags = 'LEFT JOIN signFlags';
        if (search) {
            if (search.flags.length > 0) {
                signFlags = `JOIN (SELECT * FROM signFlags WHERE flag IN (${search.flags.join(',')})) AS signFlags`;
            }
            const cs = [];
            if (search.notation?.length>0) cs.push(`(notation LIKE '%${search.notation}%')`);
            if (search.gloss?.length>0) cs.push(`(gloss LIKE '%${search.gloss}%')`);
            if (cs.length > 0) where = "WHERE "+cs.join(" AND ");
        }
        try {
            const rows = db.prepare(`SELECT signs.*, group_concat(flags.icon, '') AS flag_icons
                FROM signs
                ${signFlags} ON signs.number = signFlags.sign
                LEFT JOIN flags ON flags.id = signFlags.flag
                ${where}
                GROUP BY signs.number
                ORDER BY ${order} ${asc?'ASC':'DESC'}
            ;`).all();
            const finished = parseInt(sql.finished.get())
            return { rows, totalCount, finished };
        } catch (e) { console.error(e); }
    },

    getFlags: async function () {
        await init;
        return sql.flags.all();
    },

});
