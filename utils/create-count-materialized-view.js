export async function createCountMaterializedView(pool, tableName){
    return await pool.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS ${tableName}_count AS (
            SELECT COUNT(*) FROM ${tableName}
        );
    `);
}