import 'colors';
import DBQueryAllocator from './utils/db-query-allocator.js';
import populateAuthorsTable from './authors/populate-authors-table.js';
import populateBooksTables from './books/populate-books-tables.js';
import populateAuthorBooks from './books/build-author-books.js';
import cleanUp from './operations/clean-up.js';
import createTrgmExtention from './operations/add-trgm-extention.js';
import indexAuthorIdInAuthorBooks from './books/index-author-id-in-author-books.js';
import createOrderedMaterializedView from './operations/create-ordered-materialized-view.js';
import createGiNIndex from './operations/create-gist-index.js'
import createCountMaterializedView from './operations/create-count-materialized-view.js';
import { config } from 'dotenv';
config();

console.time('Duration');
const dbQueryAllocator = new DBQueryAllocator(process.env.DATABASE_URL, +process.env.MAX_DB_CONNECTIONS)

try{
    await Promise.all([
        populateAuthorsTable(dbQueryAllocator),
        populateBooksTables(dbQueryAllocator)
    ]);
    console.log(`Authors And Books Inserted Successfully ✅`.green);

    await populateAuthorBooks(dbQueryAllocator);
    console.log(`Constructed Author Books Table Successfully ✅`.green);
    
    await cleanUp(dbQueryAllocator);
    console.log(`Clean-Ups are Done Successfully ✅`.green)
    
    await createTrgmExtention(dbQueryAllocator);
    console.log(`Trgm Extenstion Created Successfully ✅`.green);
    
    await Promise.all([
        indexAuthorIdInAuthorBooks(dbQueryAllocator),
        createOrderedMaterializedView(dbQueryAllocator, 'authors', 'name'), 
        createOrderedMaterializedView(dbQueryAllocator, 'books', 'title'),
        createGiNIndex(dbQueryAllocator, 'authors', 'name'),
        createGiNIndex(dbQueryAllocator, 'books', 'title'),
        createCountMaterializedView(dbQueryAllocator, 'authors'),
        createCountMaterializedView(dbQueryAllocator, 'books')
    ]);
    console.log(`Indexes And Views Created Successfully ✅`.green);
    
    console.log(`ALL DONE ✅`.bgGreen);
}
catch(err){
    console.log(err);
}
finally{
    await dbQueryAllocator.end();
    console.timeEnd('Duration');
}