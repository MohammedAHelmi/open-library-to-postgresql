export async function createCountMaterializedView(dbQueryAllocator, tableName){
    const [queryPromise] = await dbQueryAllocator.register(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableName}_count AS (
            SELECT COUNT(*) FROM ${tableName}
        );
    `);

    return await queryPromise;
}