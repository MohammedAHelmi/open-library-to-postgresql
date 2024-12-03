import { join } from 'path';
import AuthorsExtractor from './author-extractor.js';
import AuthorsWriter from './db-writer.js';
import TablePopulatingPipelineBuilder from '../utils/table-populating-pipeline-builder.js';

const populateAuthorsTable = async function(pool) {
    const authorsTablePopulatingPipeline = new TablePopulatingPipelineBuilder();
    await authorsTablePopulatingPipeline
    .setFilePath(join(import.meta.dirname, '../data/authors-dump.txt'))
    .setExtractorStream(new AuthorsExtractor())
    .setDBWriter(new AuthorsWriter(pool, { MAX_CONCURRENT_QUERIES: +process.env.MAX_DB_CONNECTIONS }))
    .getPipeline();
}

export default populateAuthorsTable;