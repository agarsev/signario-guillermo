const { app } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { mainGetDB } = require('./common/back.js');

module.exports = async function merge_db (db_to_merge) {

  console.log(`MEZCLAR ${db_to_merge}`);

  const db = mainGetDB();
  const last_merge = db.prepare("SELECT value FROM config WHERE key = 'last_merge'").pluck().get();

  const user_path = app.getPath('userData');
  const new_path = path.join(user_path, 'signario.db.new');
  await fs.copyFile(db_to_merge, new_path);
  db.exec(`ATTACH '${new_path}' AS new_db`);

  const conflicts = db.prepare(`SELECT * FROM new_db.signs
  JOIN signs USING (number)
  WHERE new_db.signs.modified_at > :last_merge AND main.signs.modified_at > :last_merge
  `).raw().all({ last_merge });

  const report_path = path.join(app.getPath('home'), 'GUILLERMO_MERGE_REPORT.txt');
  if (conflicts.length>0) {
    await fs.writeFile(report_path,
      "MERGE CONFLICTS\n\nFirst row is our old (lost) value, second row is incoming (used) value.\n\n"+
      conflicts.map(row =>
        `${row[0]}\n  ${row.slice(5,9).join(' | ')}\n  ${row.slice(1,5).join(' | ')}\n`)
      .join('\n'));
  }

  //- Add own with no conflicts to new
  
  // Map flags
  /*
  db.exec(`INSERT INTO new_db.flags(icon, name)
  SELECT main.flags.icon, main.flags.name FROM flags
  LEFT JOIN new_db.flags USING(icon)
  WHERE new_db.flags.id is null;`);
  db.exec(`CREATE TEMP TABLE flag_map AS
  SELECT main.flags.id AS old_flag, new_db.flags.id AS new_flag
  FROM new_db.flags RIGHT JOIN flags USING(icon);`);
  */
  //- Add sign_flags to new for no conflicts using map

  console.log("FINISHED");
  
  db.close();
  //Move own to signario.old
  //Move new to signario

  return [conflicts.length, report_path];
}

/*
 

Conflict: last update > last_merge_date in own and new
No conflict to add: last update > last_merge_date in own

*/
