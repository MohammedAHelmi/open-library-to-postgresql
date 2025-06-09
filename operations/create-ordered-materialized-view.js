export default async function createOrderedMaterializedView(dbQueryAllocator, tableName, columnName){
    const viewName =  constructViewName(tableName, columnName);
    await createMaterializedView(dbQueryAllocator, viewName, tableName, columnName);
    await createIndexOnMaterializedView(dbQueryAllocator, viewName, `row_num`);
}

function constructViewName(tableName, columnName){
    return `ordered_${tableName}_${columnName}_view`;
}

async function createMaterializedView(dbQueryAllocator, viewName, tableName, columnName){
    const [queryPromise] = await dbQueryAllocator.register(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS ${viewName} AS (
            SELECT id, ROW_NUMBER() OVER ( ORDER BY ${columnName} ) AS row_num
	        FROM ${tableName}
        );
    `);

    return await queryPromise;
}

async function createIndexOnMaterializedView(dbQueryAllocator, viewName, columnName){
    const [queryPromise] = await dbQueryAllocator.register(`CREATE INDEX ON ${viewName} (${columnName})`);
    return await queryPromise;
}
