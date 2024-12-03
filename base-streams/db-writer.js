import { Writable } from 'stream';
import pg from 'pg';

class DBWriter extends Writable{
    #pool;
    #MAX_CONCURRENT_QUERIES;
    #runningQueriesCount;
    #waitingList;
    #endStream;

    constructor(pool, options){
        if(typeof options?.MAX_CONCURRENT_QUERIES !== 'number')
            throw new Error(`Expected MAX_CONCURRENT_QUERIES option to be a number`);

        const { MAX_CONCURRENT_QUERIES, ...restOptions } = options;
        super({ restOptions, objectMode: true });

        if(!(pool instanceof pg.Pool))
            throw new Error(`Expected pool to an instance of Pool`);
        this.#pool = pool;

        this.#MAX_CONCURRENT_QUERIES = MAX_CONCURRENT_QUERIES;
        this.#runningQueriesCount = 0;
        this.#waitingList = [];
        this.#endStream = null;
    }

    async _getAllocation(){
        if(this.#runningQueriesCount++ < this.#MAX_CONCURRENT_QUERIES)
            return;
            
        await (new Promise(resolve => this.#waitingList.push(resolve)));
    }

    _releaseAllocation(){
        this.#runningQueriesCount--;
        const runPending = this.#waitingList.pop();
        runPending && runPending();
    
        this.#waitingList.length === 0 && this.#runningQueriesCount === 0 && this.#endStream && this.#endStream();
    }

    async _executeQuery(sql, params){
        return this.#pool.query(sql, params);
    }

    async _write(){
        throw new Error(`_write() must be implemented`)
    }

    _final(cb){
        this.#endStream = cb;
    }
}

export default DBWriter;