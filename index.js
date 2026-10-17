// Vercel kabi serverless hostinglar uchun kirish nuqtasi (oddiy serverda `npm start` ishlatiladi).
// Ilova eksport qilinadi; jadvallar har bir yangi nusxada bir marta tayyorlanadi.
require('dotenv').config();
const { createApp } = require('./src/app');
const { migrate } = require('./src/db');

const ready = migrate();
ready.catch((e) => console.error('Migratsiya xatosi:', e));
module.exports = createApp({ ready });
