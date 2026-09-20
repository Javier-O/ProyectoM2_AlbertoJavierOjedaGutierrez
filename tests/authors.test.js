import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Authors API', () => {
  let createdAuthorId;

  it('POST /authors - crea un author correctamente', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ name: 'Test Author', email: `test-${Date.now()}@example.com`, bio: 'Bio de prueba' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Author');

    createdAuthorId = res.body.id; // lo reutilizamos en los siguientes tests
  });

  it('GET /authors/:id - obtiene el author recién creado', async () => {
    const res = await request(app).get(`/authors/${createdAuthorId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAuthorId);
    expect(res.body.name).toBe('Test Author');
  });

  it('POST /authors - sin "name" responde 400', async () => {
    const res = await request(app)
      .post('/authors')
      .send({ email: 'sinnombre@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /authors - con email duplicado responde 400', async () => {
    const first = await request(app).get(`/authors/${createdAuthorId}`);

    const res = await request(app)
      .post('/authors')
      .send({ name: 'Otro Nombre', email: first.body.email });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /authors/:id - id inexistente responde 404', async () => {
    const res = await request(app).get('/authors/999999');

    expect(res.status).toBe(404);
  });

  it('DELETE /authors/:id - elimina el author de prueba y limpia', async () => {
    const res = await request(app).delete(`/authors/${createdAuthorId}`);

    expect(res.status).toBe(204);
  });

  it('DELETE /authors/:id - id inexistente responde 404', async () => {
    const res = await request(app).delete('/authors/999999');

    expect(res.status).toBe(404);
  });
});
