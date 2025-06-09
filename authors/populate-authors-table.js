import AuthorsExtractor from './author-extractor.js';
import AuthorsWriter from './db-writer.js';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';

export default function populateAuthorsTable(dbQueryAllocator) {
    return pipeline(
        createReadStream(join(import.meta.dirname, '../data/authors-dump.txt.gz'), { highWaterMark: 1024*1024 }),
        createGunzip({ chunkSize: 1024*1024 }),
        new AuthorsExtractor(),
        new AuthorsWriter(dbQueryAllocator, { 
            maxBatchSize: +process.env.BATCH_SIZE, 
            tableName: 'authors', 
            columns: ['name', 'bio', 'openlibrary_key'] 
        })
    );
}