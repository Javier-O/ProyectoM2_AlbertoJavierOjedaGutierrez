require('dotenv').config();
const app = require('./app');

// server.js ahora solo se encarga de arrancar el proceso (app.listen).
// Toda la configuración de Express vive en app.js, que es lo que
// Supertest va a importar directamente en los tests, sin pasar por aquí.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
