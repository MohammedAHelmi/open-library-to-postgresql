export default async function createGiNIndex(dbQueryAllocator, tableName, columnName){
    const [queryPromise] = await dbQueryAllocator.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        CREATE INDEX ${tableName}_${columnName}_gin_idx ON ${tableName} USING GIN (${columnName} gin_trgm_ops);
    `);

    return await queryPromise;
}