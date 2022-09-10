const { contextBridge } = require('electron');

const { db } = require('../common/back.js');

const sqlSelect = db.prepare("SELECT * FROM signs WHERE number = ?");
const sqlUpdate = db.prepare(`UPDATE signs SET
    gloss = coalesce(:gloss, gloss),
    notation = coalesce(:notation, notation),
    modified_at = coalesce(:modified_at, CURRENT_TIMESTAMP)
    WHERE number = ? RETURNING *`);

contextBridge.exposeInMainWorld('back', {

    select: number => sqlSelect.get(number),
    update: (number, {gloss,notation,modified_at}) => sqlUpdate.get(number, {gloss,notation,modified_at}),

});
