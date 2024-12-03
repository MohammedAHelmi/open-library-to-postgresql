const dropOpenlibaryKey = async function(pool){
    await pool.query('ALTER TABLE authors DROP COLUMN IF EXISTS openlibary_key;');
}

const doCleanUps = async function(pool){
    await dropOpenlibaryKey(pool);
}

export default doCleanUps;