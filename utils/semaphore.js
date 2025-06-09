export default class Semaphore {
    #MAX_CONCURRENCY;
    #currentCount;
    #queue;
    constructor(MAX_CONCURRENCY) {
        this.#MAX_CONCURRENCY = MAX_CONCURRENCY;
        this.#currentCount = 0;
        this.#queue = [];
    }
  
    async acquire() {
        if (this.#currentCount < this.#MAX_CONCURRENCY) {
            this.#currentCount++;
            return;
        }
    
        return new Promise(resolve => this.#queue.push(resolve));
    }
  
    release() {
        this.#currentCount--;
        const next = this.#queue.shift();
        if(next){
            this.#currentCount++;
            next();
        }
    }
}