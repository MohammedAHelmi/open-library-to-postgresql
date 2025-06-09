/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.sql(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS authors (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            bio TEXT,
            openlibrary_key VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS books(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            openlibrary_key VARCHAR(255) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS author_books_keys (
            author_key VARCHAR(255) NOT NULL,
            book_key VARCHAR(255) NOT NULL,
            PRIMARY KEY(author_key, book_key)
        );

        CREATE TABLE IF NOT EXISTS author_books(
            author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
            book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            PRIMARY KEY (book_id, author_id)
        );
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS authors CASCADE;
        DROP TABLE IF EXISTS books CASCADE;
        DROP TABLE IF EXISTS author_books_keys CASCADE;
        DROP TABLE IF EXISTS author_books CASCADE;
    `);
};
