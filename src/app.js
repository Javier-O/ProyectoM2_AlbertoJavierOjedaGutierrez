const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authorsRoutes = require('./routes/authors.routes');
const postsRoutes = require('./routes/posts.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

// Endpoint de salud: nos sirve para confirmar que el servidor levanta bien,
// antes de agregar rutas de authors/posts.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Documentación interactiva: sirve el openapi.yaml (que vive en la raíz del
// proyecto, un nivel arriba de src/) como una página de Swagger UI en /docs.
const openapiDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

// El manejador de errores va AL FINAL, después de todas las rutas.
// Express lo detecta automáticamente por tener 4 parámetros (err, req, res, next).
app.use(errorHandler);

module.exports = app;
