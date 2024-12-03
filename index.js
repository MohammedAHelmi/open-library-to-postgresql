import pg from 'pg';
import 'colors';
import populateAuthorsTable from './authors/populate-authors-table.js';
import populateBooksTables from './books/populate-books-tables.js';
import indexAuthorIdInBookAuthors from './books/index-author-id-in-book-authors.js';
import doAuthorsCleanUps from './authors/author-clean-ups.js';
import createOrderedMaterializedView from './utils/create-ordered-materialized-view.js';
import { createCountMaterializedView } from './utils/create-count-materialized-view.js';
import createGiSTIndex from './utils/create-gist-index.js'
import { config } from 'dotenv';
config();

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: +process.env.MAX_DB_CONNECTIONS
});

try{
    await populateAuthorsTable(pool);
    await populateBooksTables(pool);
    await doAuthorsCleanUps(pool);
    await indexAuthorIdInBookAuthors(pool);
    console.log(`Inserting data is Done...`.green);

    await Promise.all([
        createOrderedMaterializedView(pool, 'authors', 'name'), 
        createOrderedMaterializedView(pool, 'books', 'title'),
        createGiSTIndex(pool, 'authors', 'name'),
        createGiSTIndex(pool, 'books', 'title'),
        createCountMaterializedView(pool, 'authors'),
        createCountMaterializedView(pool, 'books')
    ]);

    console.log(`ALL DONE`.blue);
}
catch(err){
    console.log(err);
}
finally{
    await pool.end();
}