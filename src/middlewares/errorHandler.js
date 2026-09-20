// Middleware global de errores. Express lo reconoce porque tiene 4 parámetros
// (err, req, res, next) y debe registrarse DESPUÉS de todas las rutas en server.js.
//
// Cualquier error que llegue por "next(err)" desde las rutas termina aquí,
// en vez de tener que repetir esta lógica en cada endpoint.

function errorHandler(err, req, res, next) {
  console.error(err);

  // Códigos de error de PostgreSQL:
  // https://www.postgresql.org/docs/current/errcodes-appendix.html

  // 23505 = unique_violation -> ej. email duplicado
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Ya existe un registro con ese valor único (por ejemplo, el email)' });
  }

  // 23503 = foreign_key_violation -> ej. author_id que no existe (visto en el Paso 3)
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referencia inválida: el author_id indicado no existe' });
  }

  // 23502 = not_null_violation -> falta un campo obligatorio a nivel de base de datos
  if (err.code === '23502') {
    return res.status(400).json({ error: 'Falta un campo obligatorio' });
  }

  // Cualquier otro error que no reconocemos: no lo mostramos tal cual al cliente
  // (podría filtrar detalles internos), respondemos genérico con 500.
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;
