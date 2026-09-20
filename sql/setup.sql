-- Tabla de autores
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de posts, con relación 1:N hacia authors
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);

-- Índice sobre author_id: casi todas las consultas de "posts de un autor"
-- (GET /posts/author/:authorId) van a filtrar por esta columna, así que
-- conviene indexarla para que esas búsquedas sean rápidas.
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
