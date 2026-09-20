const pool = require('../db/pool');

async function getAll() {
  const result = await pool.query('SELECT * FROM posts ORDER BY id');
  return result.rows;
}

async function getById(id) {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
}

// Reutiliza la misma query #8 que probaste a mano en el Paso 3.
async function getByAuthorId(authorId) {
  const result = await pool.query(
    `SELECT p.*, a.name AS author_name
     FROM posts p
     JOIN authors a ON p.author_id = a.id
     WHERE p.author_id = $1
     ORDER BY p.id`,
    [authorId]
  );
  return result.rows;
}

async function create({ title, content, author_id, published }) {
  const result = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, author_id, !!published]
  );
  return result.rows[0];
}

async function update(id, { title, content, published }) {
  const result = await pool.query(
    `UPDATE posts
     SET title = COALESCE($1, title),
         content = COALESCE($2, content),
         published = COALESCE($3, published)
     WHERE id = $4
     RETURNING *`,
    [title, content, published, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
}

module.exports = { getAll, getById, getByAuthorId, create, update, remove };
