export default async function createTrgmExtention(dbQueryAllocator){
    const [queryPromise] = await dbQueryAllocator.register(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
    `);

    return await queryPromise;
}
