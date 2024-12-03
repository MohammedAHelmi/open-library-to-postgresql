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
        CREATE TABLE IF NOT EXISTS book_authors(
            book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
            author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
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
    pgm.sql(`DROP TABLE IF EXISTS book_authors CASCADE;`);
};
