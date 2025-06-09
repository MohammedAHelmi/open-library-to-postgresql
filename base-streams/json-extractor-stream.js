import { once, EventEmitter } from 'events';
import { Duplex } from 'stream';

class JSONExtractorStream extends Duplex {
    _pattern;
    _matches;
    #tail;
    #eventEmitter;
    #pendingRead;

    constructor(options){
        super({...options, objectMode: true});
        this._pattern = /[^{]*({.+})\n/gi;
        this._matches = [];
        this.#tail = '';
        this.#eventEmitter = new EventEmitter();
        this.#pendingRead = false;
        this.once('finish', () => this.#eventEmitter.emit('data')); // when inputs finishes push(null) wouldn't call _write but _read may still be dangling
    }

    async _write(chunk, _, cb){
        this.#tail += chunk;

        const JsonMatches = Array
        .from( this.#tail.matchAll(this._pattern) )
        .map( match => JSON.parse(match[1]) );

        this._matches.push(
            ...JsonMatches
        );
        
        this.#tail = this.#tail.replace(this._pattern, '');

        this.#eventEmitter.emit('data');
        await once(this.#eventEmitter, 'drain');
        cb();
    }

    async _read(){
        if(this.#pendingRead)
            return;

        while(true){
            if(this._matches.length > 0){
                const item = this._getItem();
                if(!this.push(item))
                    return;
                continue;
            }
            
            if(this.writableFinished)
                return void this.push(null);
            
            this.#pendingRead = true;
            this.#eventEmitter.emit('drain');
            await once(this.#eventEmitter, 'data');
            this.#pendingRead = false;
        }
    }

    _getItem(){
        throw new Error(`_getItem() must be implemented`)
    }
}

export default JSONExtractorStream;