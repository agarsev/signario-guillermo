const { contextBridge } = require('electron');

const { getDB } = require('../common/back.js');

let db, sqlSelect, sqlUpdate;
const init = (async function () {
    db = await getDB();
    sqlSelect = db.prepare("SELECT * FROM signs WHERE number = ?");
    sqlUpdate = db.prepare(`UPDATE signs SET
        gloss = coalesce(:gloss, gloss),
        notation = coalesce(:notation, notation),
        modified_at = coalesce(:modified_at, CURRENT_TIMESTAMP)
        WHERE number = ? RETURNING *`);
})();

contextBridge.exposeInMainWorld('back', {

    select: async number => {
        await init;
        return sqlSelect.get(number);
    },

    update: async (number, {gloss,notation,modified_at}) => {
        await init;
        return sqlUpdate.get(number, {gloss,notation,modified_at});
    }

});
