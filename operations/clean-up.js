export default async function cleanUp(allocator){
    await allocator.register('ALTER TABLE authors DROP COLUMN IF EXISTS openlibrary_key;');
    await allocator.register('ALTER TABLE books DROP COLUMN IF EXISTS openlibrary_key;');
    await allocator.register('DROP TABLE IF EXISTS author_books_keys CASCADE;');
}