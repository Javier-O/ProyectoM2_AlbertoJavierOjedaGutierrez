require('dotenv').config();
const { Pool } = require('pg');

// Vitest pone process.env.NODE_ENV = 'test' automáticamente al correr los tests.
// Si definiste DB_NAME_TEST en tu .env, la usamos en vez de tu base de desarrollo,
// para que correr los tests no borre ni modifique tus datos de trabajo normales.
const dbName =
  process.env.NODE_ENV === 'test' && process.env.DB_NAME_TEST
    ? process.env.DB_NAME_TEST
    : process.env.DB_NAME;

// Si existe DATABASE_URL (como en Railway), la usamos directamente.
// Si no, armamos la conexión con las variables sueltas (para desarrollo local).
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
    });

module.exports = pool;
