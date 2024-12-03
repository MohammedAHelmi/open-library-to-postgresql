import { join } from 'path';
import BooksExtractor from './book-extractor.js';
import BooksWriter from './db-writer.js';
import TablePopulatingPipelineBuilder from '../utils/table-populating-pipeline-builder.js';

const populateBooksTables = async function(pool) {
    const booksTablePopulatingPipeline = new TablePopulatingPipelineBuilder();
    await booksTablePopulatingPipeline
    .setFilePath(join(import.meta.dirname, '../data/works-dump.txt'))
    .setExtractorStream(new BooksExtractor())
    .setDBWriter(new BooksWriter(pool, { MAX_CONCURRENT_QUERIES: +process.env.MAX_DB_CONNECTIONS }))
    .getPipeline();
}

export default populateBooksTables;