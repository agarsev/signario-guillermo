const { contextBridge } = require('electron');

const { getDB } = require('../common/back.js');

let db, sql = {};
const init = (async function () {
    db = await getDB();
    try {
        sql.select = db.prepare("SELECT * FROM signs WHERE number = ?");
        sql.update = db.prepare(`UPDATE signs SET
            gloss = coalesce(:gloss, gloss),
            notation = coalesce(:notation, notation),
            modified_by = :modified_by,
            modified_at = coalesce(:modified_at, datetime('now','localtime'))
            WHERE number = ?`);
        sql.getFlags = db.prepare(`SELECT flags.*,
            signFlags.sign is not null AS checked
            FROM flags LEFT JOIN signFlags
            ON flags.id = signFlags.flag AND signFlags.sign = ?;`);
        sql.flagAdd = db.prepare("INSERT OR IGNORE INTO signFlags(sign, flag) VALUES (?, ?)");
        sql.flagRemove = db.prepare("DELETE FROM signFlags WHERE sign = ? AND flag = ?");
        sql.flagCreate = db.prepare("INSERT INTO flags(icon, name) VALUES (?, ?) RETURNING id").pluck();
    } catch (e) { console.error(e) };
})();

async function getSign (number) {
    return {
        ...await sql.select.get(number),
        flags: await sql.getFlags.all(number)
    };
}

contextBridge.exposeInMainWorld('back', {

    select: async number => { await init; return getSign(number); },

    update: async (number, {gloss,notation,modified_at,modified_by,flags}) => {
        await init;
        if (flags) flags.forEach(f => {
            if (f.checked) sql.flagAdd.run(number, f.id);
            else sql.flagRemove.run(number, f.id);
        });
        await sql.update.run(number, {gloss,notation,modified_at,modified_by});
        return getSign(number);
    },

    createFlag: async (number, icon, name) => {
        const flid = await sql.flagCreate.get(icon, name);
        await sql.flagAdd.run(number, flid);
        return getSign(number);
    },

});
