import { Transform } from 'stream'
import giveSchema from './utils/give-schema.js';
import mergeSchemas from './utils/merge-schemas.js';

class SchemaDiscoverer extends Transform{
    #schema;
    constructor(options){
        super({ ...options, objectMode: true });
        this.#schema = null;
    }

    _transform(chunk, enc, cb){
        const objectSchema = giveSchema(chunk);
        this.#schema = mergeSchemas(this.#schema, objectSchema);
        cb();
    }

    _flush(cb){
        this.push(JSON.stringify(this.#schema, null, 4));
        cb();
    }
}

export default SchemaDiscoverer;