const path = require('path');
const fs = require('fs');
const knex = require('knex');

const url = process.env.DATABASE_URL || '';
const isPg = /^postgres/i.test(url);

let cfg;
if (isPg) {
  // bigint ni son sifatida qaytarish (vaqt tamg'alari uchun)
  require('pg').types.setTypeParser(20, (v) => Number(v));
  // Serverless (Vercel)da har bir nusxa 1 ta ulanish ushlaydi, aks holda bazaning ulanish limiti tugaydi
  cfg = { client: 'pg', connection: url, pool: { min: 0, max: process.env.VERCEL ? 1 : 10 } };
} else {
  const file = path.resolve(process.env.SQLITE_FILE || './data/ombor.db');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  cfg = {
    client: 'better-sqlite3',
    connection: { filename: file },
    useNullAsDefault: true,
    pool: { afterCreate: (c, done) => { c.pragma('foreign_keys = ON'); c.pragma('journal_mode = WAL'); done(null, c); } },
  };
}

const db = knex(cfg);
const migrate = () => db.migrate.latest({ directory: path.join(__dirname, 'migrations') });

module.exports = { db, migrate, isPg };
