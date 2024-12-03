async function indexAuthorIdInBookAuthors(pool){
    return await pool.query(` CREATE INDEX IF NOT EXISTS book_authors_author_id_idx ON book_authors (author_id);`)
}

export default indexAuthorIdInBookAuthors;