import { createReadStream, createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import { join } from 'path';
import AuthorExtractorStream from '../authors/author-extractor.js';
import BookExtractorStream from '../books/book-extractor.js';
import SchemaDiscoverer from './schema-discoverer-stream.js';
import createChunkCountMonitor from '../utils/chunk-counting-hook.js';


await Promise.all([
    pipeline(
        createReadStream(join(import.meta.dirname, '../data/authors-dump.txt.gz'), { highWaterMark: 1024 * 1024 }),
        createGunzip({ chunkSize: 1024 * 1024 }),
        new AuthorExtractorStream(),
        createChunkCountMonitor('AUTHORS', 20),
        new SchemaDiscoverer(),
        createWriteStream(join(import.meta.dirname, 'author-schema.txt'))
    ),
    pipeline(
        createReadStream(join(import.meta.dirname, '../data/works-dump.txt.gz'), { highWaterMark: 1024 * 1024 }),
        createGunzip({ chunkSize: 1024 * 1024 }),
        new BookExtractorStream(),
        createChunkCountMonitor('BOOKS', 20),
        new SchemaDiscoverer(),
        createWriteStream(join(import.meta.dirname, 'books-schema.txt'))
    )
]);