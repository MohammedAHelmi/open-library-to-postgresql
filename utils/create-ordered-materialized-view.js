function constructViewName(tableName, columnName){
    return `ordered_${tableName}_${columnName}_view`;
}

async function createMaterializedView(pool, viewName, tableName, columnName){
    return await pool.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS ${viewName} AS (
            SELECT id, ROW_NUMBER() OVER ( ORDER BY ${columnName} ) AS row_num
	        FROM ${tableName}
        );
    `);
}

async function createIndexOnMaterializedView(pool, viewName, columnName){
    return await pool.query(`CREATE INDEX ON ${viewName} (${columnName})`);
}

async function createOrderedMaterializedView(pool, tableName, columnName){
    const viewName =  constructViewName(tableName, columnName);
    await createMaterializedView(pool, viewName, tableName, columnName);
    await createIndexOnMaterializedView(pool, viewName, `row_num`);
}

export default createOrderedMaterializedView;