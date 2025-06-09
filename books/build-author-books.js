import DBQueryAllocator from "../utils/db-query-allocator.js";

/**
 * 
 * @param {DBQueryAllocator} dbQueryAllocator 
 */
export default async function populateAuthorBooks(dbQueryAllocator){
    const query = (`
        INSERT INTO author_books (author_id, book_id)
        SELECT authors.id, books.id
        FROM author_books_keys keys
        JOIN authors ON keys.author_key = authors.openlibrary_key
        JOIN books ON keys.book_key = books.openlibrary_key;
    `);
    
    const [queryPromise] = await dbQueryAllocator.register(query);
    return await queryPromise;
}