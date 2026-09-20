const express = require('express');
const router = express.Router();
const authorsService = require('../services/authors.service');
const { validateAuthorCreate, validateAuthorUpdate } = require('../middlewares/validators');

// GET /authors - listar todos
router.get('/', async (req, res, next) => {
  try {
    const authors = await authorsService.getAll();
    res.status(200).json(authors);
  } catch (err) {
    next(err); // se lo pasamos al middleware de errores (lo armamos en el Paso 6)
  }
});

// GET /authors/:id - detalle de uno
router.get('/:id', async (req, res, next) => {
  try {
    const author = await authorsService.getById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(200).json(author);
  } catch (err) {
    next(err);
  }
});

// POST /authors - crear
router.post('/', validateAuthorCreate, async (req, res, next) => {
  try {
    const newAuthor = await authorsService.create(req.body);
    res.status(201).json(newAuthor);
  } catch (err) {
    next(err);
  }
});

// PUT /authors/:id - actualizar
router.put('/:id', validateAuthorUpdate, async (req, res, next) => {
  try {
    const updated = await authorsService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /authors/:id - eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await authorsService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Author no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
