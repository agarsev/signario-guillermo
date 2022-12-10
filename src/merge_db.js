const { app } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const { mainGetDB } = require('./common/back.js');

module.exports = async function merge_db (db_to_merge) {

  const db = mainGetDB();
  const last_merge = db.prepare("SELECT value FROM config WHERE key = 'last_merge'").pluck().get();

  const user_path = app.getPath('userData');
  const true_path = path.join(user_path, 'signario.db');
  const new_path = path.join(user_path, 'signario.db.new');
  const old_path = path.join(user_path, 'signario.db.old');

  await fs.copyFile(db_to_merge, new_path);
  db.exec(`ATTACH '${new_path}' AS new_db`);

  // Find and report conflicts (both modified later than last_merge)
  const conflicts = db.prepare(`SELECT * FROM new_db.signs
      JOIN signs USING (number)
    WHERE main.signs.modified_at > new_db.signs.modified_at
      AND new_db.signs.modified_at > :last_merge`).raw().all({ last_merge });

  const report_path = path.join(app.getPath('home'), 'GUILLERMO_MERGE_REPORT.txt');
  if (conflicts.length>0) {
    await fs.writeFile(report_path,
      "MERGE CONFLICTS\n\nFirst row is our old (lost) value, second row is incoming (used) value.\n\n"+
      conflicts.map(row =>
        `${row[0]}\n  ${row.slice(5,9).join(' | ')}\n  ${row.slice(1,5).join(' | ')}\n`)
      .join('\n'));
  }

  // Add own with no conflicts to new
  db.prepare(`CREATE TEMP TABLE to_merge AS
    SELECT number FROM signs AS our
      JOIN new_db.signs AS new USING(number)
    WHERE our.modified_at > new.modified_at
      AND new.modified_at <= :last_merge`).run({ last_merge });
  db.exec(`UPDATE new_db.signs SET
      gloss = our.gloss, notation = our.notation,
      modified_at = our.modified_at, modified_by = our.modified_by
    FROM to_merge JOIN main.signs AS our USING(number)
    WHERE new_db.signs.number = our.number`);

  // Map flags and add
  db.exec(`INSERT INTO new_db.flags(icon, name)
    SELECT main.flags.icon, main.flags.name FROM flags
    LEFT JOIN new_db.flags USING(icon)
    WHERE new_db.flags.id is null;`);
  db.exec(`CREATE TEMP TABLE flag_map AS
    SELECT main.flags.id AS old_flag, new_db.flags.id AS new_flag
    FROM new_db.flags RIGHT JOIN flags USING(icon);`);
  db.exec(`DELETE FROM new_db.signFlags WHERE sign IN to_merge;`);
  db.exec(`INSERT INTO new_db.signFlags(sign, flag)
    SELECT sign, new_flag AS flag FROM main.signFlags
      JOIN flag_map ON old_flag = main.signFlags.flag
      JOIN to_merge ON to_merge.number = main.signFlags.sign`);

  // Add attachments with no conflict
  db.prepare(`INSERT OR REPLACE INTO new_db.attachments
    SELECT our.* FROM to_merge
    JOIN main.attachments AS our ON our.sign = to_merge.number`);

  db.prepare("UPDATE new_db.config SET value = datetime('now') WHERE key == 'last_merge'").run();
  db.close();
  
  await fs.rename(true_path, old_path);
  await fs.rename(new_path, true_path);

  return [conflicts.length, report_path];
}
