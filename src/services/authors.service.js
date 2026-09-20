const pool = require('../db/pool');

async function getAll() {
  const result = await pool.query('SELECT * FROM authors ORDER BY id');
  return result.rows;
}

async function getById(id) {
  const result = await pool.query('SELECT * FROM authors WHERE id = $1', [id]);
  return result.rows[0];
}

async function create({ name, email, bio }) {
  const result = await pool.query(
    'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
    [name, email, bio || null]
  );
  return result.rows[0];
}

// COALESCE($n, columna): si el valor que llega es undefined/null, conserva
// el valor que ya estaba en la fila. Así el PUT admite actualizaciones
// parciales (mandar solo "bio" sin tener que repetir name y email).
async function update(id, { name, email, bio }) {
  const result = await pool.query(
    `UPDATE authors
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         bio = COALESCE($3, bio)
     WHERE id = $4
     RETURNING *`,
    [name, email, bio, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query('DELETE FROM authors WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

module.exports = { getAll, getById, create, update, remove };
