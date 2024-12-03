async function createGiSTIndex(pool, tableName, columnName){
    return await pool.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        CREATE INDEX ${tableName}_${columnName}_gist_idx ON ${tableName} USING GIST (${columnName} gist_trgm_ops);
    `);
}

export default createGiSTIndex;