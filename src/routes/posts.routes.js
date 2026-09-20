const express = require('express');
const router = express.Router();
const postsService = require('../services/posts.service');
const { validatePostCreate, validatePostUpdate } = require('../middlewares/validators');

// GET /posts - listar todos
router.get('/', async (req, res, next) => {
  try {
    const posts = await postsService.getAll();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/author/:authorId - IMPORTANTE: sigue antes que "/:id" (ver Paso 4)
router.get('/author/:authorId', async (req, res, next) => {
  try {
    const posts = await postsService.getByAuthorId(req.params.authorId);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

// GET /posts/:id - detalle de uno
router.get('/:id', async (req, res, next) => {
  try {
    const post = await postsService.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
});

// POST /posts - crear
router.post('/', validatePostCreate, async (req, res, next) => {
  try {
    const newPost = await postsService.create(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

// PUT /posts/:id - actualizar
router.put('/:id', validatePostUpdate, async (req, res, next) => {
  try {
    const updated = await postsService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /posts/:id - eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await postsService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
