import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import AuthorExtractorStream from '../authors/author-extractor.js';
import BookExtractorStream from '../books/book-extractor.js';
import SchemaDiscoverer from './schema-discoverer-stream.js';


await pipeline(
    createReadStream(join(import.meta.dirname, '../data/authors-dump.txt')),
    new AuthorExtractorStream(),
    new SchemaDiscoverer(),
    createWriteStream(join(import.meta.dirname, 'author-schema.txt'))
);

await pipeline(
    createReadStream(join(import.meta.dirname, '../data/works-dump.txt')),
    new BookExtractorStream(),
    new SchemaDiscoverer(),
    createWriteStream(join(import.meta.dirname, 'books-schema.txt'))
);
