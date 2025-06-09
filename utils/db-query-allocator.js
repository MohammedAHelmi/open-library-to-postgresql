import pg from 'pg';
import Semaphore from './semaphore.js';

export default class DBQueryAllocator{
    #pool;
    #semaphore;
    constructor(dbURL, poolLimit){
        this.#pool = new pg.Pool({
            connectionString: dbURL,
            max: poolLimit
        });
        this.#semaphore = new Semaphore(poolLimit);
    }

    async register(query, params){
        await this.#semaphore.acquire();

        const queryPromise = this.#pool
        .query(query, params)
        .finally(
            () => this.#semaphore.release()
        );
        
        return [queryPromise];
    }

    async end(){
        return await this.#pool.end();
    }
}