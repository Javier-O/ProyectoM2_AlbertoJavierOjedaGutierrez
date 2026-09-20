// Validaciones simples de "forma" del dato (¿existe?, ¿no está vacío?).
// Las validaciones que dependen de la base de datos (¿el email ya existe?,
// ¿el author_id es real?) las dejamos para el errorHandler, porque ahí es
// donde realmente se pueden verificar sin hacer una consulta extra.

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function validateAuthorCreate(req, res, next) {
  const { name, email } = req.body;
  if (isBlank(name)) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio' });
  }
  if (isBlank(email)) {
    return res.status(400).json({ error: 'El campo "email" es obligatorio' });
  }
  next();
}

function validateAuthorUpdate(req, res, next) {
  const { name, email } = req.body;
  if (name !== undefined && isBlank(name)) {
    return res.status(400).json({ error: 'El campo "name" no puede estar vacío' });
  }
  if (email !== undefined && isBlank(email)) {
    return res.status(400).json({ error: 'El campo "email" no puede estar vacío' });
  }
  next();
}

function validatePostCreate(req, res, next) {
  const { title, content, author_id } = req.body;
  if (isBlank(title)) {
    return res.status(400).json({ error: 'El campo "title" es obligatorio' });
  }
  if (isBlank(content)) {
    return res.status(400).json({ error: 'El campo "content" es obligatorio' });
  }
  if (author_id === undefined || author_id === null || author_id === '') {
    return res.status(400).json({ error: 'El campo "author_id" es obligatorio' });
  }
  next();
}

function validatePostUpdate(req, res, next) {
  const { title, content } = req.body;
  if (title !== undefined && isBlank(title)) {
    return res.status(400).json({ error: 'El campo "title" no puede estar vacío' });
  }
  if (content !== undefined && isBlank(content)) {
    return res.status(400).json({ error: 'El campo "content" no puede estar vacío' });
  }
  next();
}

module.exports = {
  validateAuthorCreate,
  validateAuthorUpdate,
  validatePostCreate,
  validatePostUpdate,
};
