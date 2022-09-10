const { contextBridge } = require('electron');

const { db } = require('../common.js');

const sqlSelect = db.prepare("SELECT * FROM signs WHERE number = ?");

contextBridge.exposeInMainWorld('back', {

    select: number => sqlSelect.get(number),

});
