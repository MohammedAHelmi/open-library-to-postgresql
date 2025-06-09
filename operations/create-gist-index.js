export default async function createGiNIndex(dbQueryAllocator, tableName, columnName){
    const [queryPromise] = await dbQueryAllocator.register(`
        CREATE INDEX ${tableName}_${columnName}_gin_idx ON ${tableName} USING GIN (${columnName} gin_trgm_ops);
    `);

    return await queryPromise;
}