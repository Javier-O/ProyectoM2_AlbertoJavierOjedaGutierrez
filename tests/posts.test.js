import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Posts API', () => {
  let testAuthorId;
  let createdPostId;

  // Los posts necesitan un author_id válido (por la FK), así que creamos
  // uno de prueba antes de correr estos tests, y lo borramos al final.
  beforeAll(async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Author para Posts Test', email: `posts-test-${Date.now()}@example.com` });
    testAuthorId = res.body.id;
  });

  afterAll(async () => {
    // El ON DELETE CASCADE del schema borra automáticamente los posts
    // asociados, así que no hace falta borrarlos manualmente antes.
    await request(app).delete(`/authors/${testAuthorId}`);
  });

  it('POST /posts - crea un post correctamente', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 'Post de prueba', content: 'Contenido de prueba', author_id: testAuthorId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Post de prueba');

    createdPostId = res.body.id;
  });

  it('GET /posts/:id - obtiene el post recién creado', async () => {
    const res = await request(app).get(`/posts/${createdPostId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPostId);
  });

  it('GET /posts/author/:authorId - incluye el post recién creado', async () => {
    const res = await request(app).get(`/posts/author/${testAuthorId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p) => p.id === createdPostId)).toBe(true);
  });

  it('POST /posts - sin "title" responde 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ content: 'contenido', author_id: testAuthorId });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /posts - con author_id inexistente responde 400', async () => {
    const res = await request(app)
      .post('/posts')
      .send({ title: 't', content: 'c', author_id: 9999999 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /posts/:id - elimina el post de prueba', async () => {
    const res = await request(app).delete(`/posts/${createdPostId}`);

    expect(res.status).toBe(204);
  });

  it('DELETE /posts/:id - id inexistente responde 404', async () => {
    const res = await request(app).delete('/posts/999999');

    expect(res.status).toBe(404);
  });
});
