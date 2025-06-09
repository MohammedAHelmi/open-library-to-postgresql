export default async function indexAuthorIdAuthorBooks(dbQueryAllocator){
    const [queryPromise] = await dbQueryAllocator.register(`
        CREATE INDEX ON author_books (author_id);
    `)
    return await queryPromise;
}