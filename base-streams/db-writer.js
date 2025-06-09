import { Writable } from 'stream';
import InsertBuilder from '../utils/insert-builder.js';

class DBWriter extends Writable{
    #queryAllocator;
    #tableName;
    #columns;
    #batchSize;

    constructor(allocator, options){
        const { maxBatchSize, tableName, columns, ...restOptions } = options;
        super({ restOptions, objectMode: true });

        this.#queryAllocator = allocator;
        this.#tableName = tableName;
        this.#columns = columns;
        this._dataBatch = [];
        this.#batchSize = maxBatchSize;
    }

    async _write(chunk, _, cb){
        this._handleChunk(chunk);
        
        if(this._dataBatch.length < this.#batchSize)
            return void cb();

        const dataBatch = this._dataBatch;
        this._dataBatch = [];


        const insertBuilder = new InsertBuilder(); 
        const [query, params] = insertBuilder
        .table(this.#tableName)
        .columns(this.#columns)
        .values(dataBatch)
        .onConflictDoNothing()
        .build();

        await this.#queryAllocator.register(query, params)
        
        cb();
    }

    async _final(cb){
        if(this._dataBatch.length === 0)
            cb();
        
        const insertBuilder = new InsertBuilder(); 
        const [query, params] = insertBuilder
        .table(this.#tableName)
        .columns(this.#columns)
        .values(this._dataBatch)
        .onConflictDoNothing()
        .build();

        await this.#queryAllocator.register(query, params);
        
        cb();
    }

    _handleChunk(){
        throw new Error('_handleChunk() Must Be Implemented');
    }
}

export default DBWriter;