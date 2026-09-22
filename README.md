# API MiniBlog

Proyecto Integrador — Módulo 2 (Henry, Fullstack).

API REST en Node.js + Express, conectada a PostgreSQL, para gestionar `authors` y `posts` de un servicio de contenidos tipo MiniBlog. Incluye validaciones, manejo centralizado de errores, tests automatizados con Vitest + Supertest, y documentación OpenAPI.

## Índice
- [Descripción del proyecto](#descripción-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Cómo ejecutar los tests](#cómo-ejecutar-los-tests)
- [Documentación OpenAPI](#documentación-openapi)
- [Deployment en Railway](#deployment-en-railway)
- [Uso de IA en el proyecto](#uso-de-ia-en-el-proyecto)

## Descripción del proyecto

DevSpark necesita una API estable para el backend de MiniBlog. Esta API expone operaciones CRUD completas sobre dos entidades relacionadas:

- **authors**: `id`, `name`, `email` (único), `bio`, `created_at`
- **posts**: `id`, `title`, `content`, `author_id` (FK → authors), `published`, `created_at`

Un author puede tener muchos posts (relación 1:N). Al borrar un author, sus posts se eliminan en cascada.

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/authors` | Listar todos los authors |
| GET | `/authors/:id` | Detalle de un author |
| POST | `/authors` | Crear un author |
| PUT | `/authors/:id` | Actualizar un author (parcial) |
| DELETE | `/authors/:id` | Eliminar un author (cascada sobre sus posts) |
| GET | `/posts` | Listar todos los posts |
| GET | `/posts/:id` | Detalle de un post |
| GET | `/posts/author/:authorId` | Posts de un author específico |
| POST | `/posts` | Crear un post |
| PUT | `/posts/:id` | Actualizar un post (parcial) |
| DELETE | `/posts/:id` | Eliminar un post |

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL instalado localmente (o acceso a una instancia remota)
- Postman (o similar) para probar los endpoints manualmente

## Instalación y ejecución local

**1. Clonar el repositorio e instalar dependencias:**
```bash
git clone <URL-del-repo>
cd api-miniblog
npm install
```

**2. Crear la base de datos y correr los scripts SQL:**
```bash
psql -U postgres -c "CREATE DATABASE miniblog;"
psql -U postgres -d miniblog -f sql/setup.sql
psql -U postgres -d miniblog -f sql/seed.sql
```

**3. Configurar las variables de entorno:**
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales locales de PostgreSQL:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=miniblog
```

**4. Levantar el servidor:**
```bash
npm run dev
```
El servidor queda disponible en `http://localhost:3000`. Puedes verificar que levantó bien visitando `http://localhost:3000/health`.

## Cómo ejecutar los tests

Los tests corren contra una base de datos **separada** de la de desarrollo, para no mezclar datos.

**1. Crear la base de datos de test:**
```bash
psql -U postgres -c "CREATE DATABASE miniblog_test;"
psql -U postgres -d miniblog_test -f sql/setup.sql
psql -U postgres -d miniblog_test -f sql/seed.sql
```

**2. Agregar a tu `.env`:**
```
DB_NAME_TEST=miniblog_test
```

**3. Correr la suite:**
```bash
npm test
```

La suite incluye 14 tests (Vitest + Supertest) que cubren las operaciones CRUD principales de `authors` y `posts`, además de los casos de error (campos faltantes, email duplicado, `author_id` inexistente, recursos no encontrados).

## Documentación OpenAPI

La especificación completa está en [`openapi.yaml`](./openapi.yaml), en la raíz del proyecto.

**Para verla de forma interactiva:**
- **VS Code:** instala la extensión "Swagger Viewer", abre `openapi.yaml` y presiona `Shift+Alt+P`.
- **Online:** copia el contenido del archivo en [editor.swagger.io](https://editor.swagger.io).

## Deployment en Railway

La aplicación está desplegada en Railway, con dos servicios dentro del mismo proyecto:
- Un servicio para la API (Node.js/Express)
- Un servicio de PostgreSQL (plugin de Railway)

**Variables de entorno configuradas en el servicio de la API:**
- `DATABASE_URL` → referencia interna a `${{Postgres.DATABASE_URL}}` (Railway conecta ambos servicios automáticamente, sin exponer credenciales)
- `PORT` → inyectada automáticamente por Railway, no requiere configuración manual

**URL pública:**
```
https://proyectom2albertojavierojedagutierrez-production.up.railway.app
```

**Para replicar el deploy desde cero:**
1. Conectar el repositorio de GitHub a un nuevo proyecto de Railway.
2. Agregar un servicio de PostgreSQL dentro del mismo proyecto ("+ New" → "Database" → "Add PostgreSQL").
3. En el servicio de la API, agregar la variable `DATABASE_URL` con el valor `${{Postgres.DATABASE_URL}}`.
4. Ejecutar `sql/setup.sql` y `sql/seed.sql` desde la pestaña "Data" del servicio de Postgres.
5. Generar el dominio público desde "Settings" → "Networking" → "Generate Domain".

## Uso de IA en el proyecto

Utilicé Claude (Anthropic) como asistente durante todo el desarrollo, siguiendo el orden sugerido por la guía del módulo. Un resumen de cómo se usó en cada etapa:

- **Estructura base:** le pedí que armara la estructura de carpetas (`routes`, `services`, `middlewares`, `db`) explicando el porqué de cada separación, antes de escribir código.
- **Modelado SQL:** discutí con la IA el diseño de las tablas `authors` y `posts`, incluyendo la decisión de `ON DELETE CASCADE` en la FK y el índice sobre `author_id`.
- **Lógica en memoria y luego SQL real:** seguí el enfoque incremental de la guía — primero endpoints con arrays, después reemplazo por queries parametrizadas a PostgreSQL — pidiéndole a la IA que mantuviera la misma interfaz de funciones en los services para que el cambio fuera mínimo.
- **Validaciones y manejo de errores:** le pedí diseñar un middleware de validación y un manejador global de errores que tradujera los códigos de error de PostgreSQL (unique_violation, foreign_key_violation) a respuestas HTTP claras.
- **Testing:** originalmente se propuso Jest; al recordar que en clase vimos Vitest, le pedí migrar la suite de tests a Vitest + Supertest, incluyendo el ajuste de sintaxis a ES Modules que requiere Vitest y la separación de `app.js` (para testing) de `server.js` (arranque del proceso).
- **Documentación OpenAPI:** le pedí generar la especificación completa a partir de los endpoints ya implementados, y validarla contra el estándar oficial.
- **Deployment:** usé a la IA como guía paso a paso para el deploy en Railway (conexión de servicios, variables de entorno, generación de dominio), resolviendo en el camino un par de diferencias de interfaz entre lo que la IA esperaba y la versión actual de Railway (la pestaña "Query" ahora es parte de "Data").
- **Depuración:** cuando tuve un error al hacer `git push` (rechazo por historiales no relacionados), le pedí ayuda para diagnosticar la causa antes de aplicar una solución.

La IA no tomó decisiones de diseño por su cuenta sin mi confirmación en cada paso; el desarrollo fue iterativo, revisando y probando cada bloque de código antes de avanzar al siguiente.
