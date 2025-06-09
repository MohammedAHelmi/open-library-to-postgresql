import BooksExtractor from './book-extractor.js';
import BooksWriter from './db-writer.js';
import BookAuthorsDBWriter from './author-books-writer.js';
import Pumpify from 'pumpify';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';

const populateBooksTables = function(dbQueryAllocator) {
    const dataPump = Pumpify.obj(
        createReadStream(join(import.meta.dirname, '../data/works-dump.txt.gz'), { highWaterMark: 1024*1024 }),
        createGunzip({ chunkSize: 1024*1024 }),
        new BooksExtractor()
    );
    
    return Promise.all([
        pipeline(
            dataPump,
            new BooksWriter(dbQueryAllocator, { 
                maxBatchSize: +process.env.BATCH_SIZE, 
                tableName: 'books', 
                columns: ['openlibrary_key', 'title', 'description' ] 
            })
        ),
        pipeline(
            dataPump,
            new BookAuthorsDBWriter(dbQueryAllocator, {
                maxBatchSize: +process.env.BATCH_SIZE, 
                tableName: 'author_books_keys', 
                columns: ['author_key', 'book_key'] 
            })        
        )
    ]);
}

export default populateBooksTables;