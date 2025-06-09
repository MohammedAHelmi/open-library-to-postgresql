import 'colors';
import DBQueryAllocator from './utils/db-query-allocator.js';
import populateAuthorsTable from './authors/populate-authors-table.js';
import populateBooksTables from './books/populate-books-tables.js';
import indexAuthorIdInAuthorBooks from './books/index-author-id-in-author-books.js';
import createOrderedMaterializedView from './operations/create-ordered-materialized-view.js';
import { createCountMaterializedView } from './operations/create-count-materialized-view.js';
import createGiNIndex from './operations/create-gist-index.js'
import populateAuthorBooks from './books/build-author-books.js';
import cleanUp from './operations/clean-up.js';
import { config } from 'dotenv';
config();

const dbQueryAllocator = new DBQueryAllocator(process.env.DATABASE_URL, +process.env.MAX_DB_CONNECTIONS)
try{
    await Promise.all([
        populateAuthorsTable(dbQueryAllocator),
        populateBooksTables(dbQueryAllocator)
    ])
    await populateAuthorBooks(dbQueryAllocator);
    console.log(`Inserting Data Is Done ✅`);
    
    await cleanUp(dbQueryAllocator);

    await indexAuthorIdInAuthorBooks(dbQueryAllocator);
    console.log(`Author Id index is built successfully`.blue);

    await Promise.all([
        createOrderedMaterializedView(dbQueryAllocator, 'authors', 'name'), 
        createOrderedMaterializedView(dbQueryAllocator, 'books', 'title'),
        createGiNIndex(dbQueryAllocator, 'authors', 'name'),
        createGiNIndex(dbQueryAllocator, 'books', 'title'),
        createCountMaterializedView(dbQueryAllocator, 'authors'),
        createCountMaterializedView(dbQueryAllocator, 'books')
    ]);

    console.log(`ALL DONE`.bgGreen);
}
catch(err){
    console.log(err);
}
finally{
    await dbQueryAllocator.end();
}