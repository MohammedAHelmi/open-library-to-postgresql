import { Duplex } from 'stream';

class JSONExtractorStream extends Duplex{
    _pattern;
    _matches;
    #tail;
    #getMore;
    #pushData;

    constructor(options){
        super({...options, objectMode: true});
        this._pattern = /[^{]*({.+})\n/gi;
        this._matches = [];
        this.#tail = '';
        this.#getMore = null;
        this.#pushData = null;
        this.on('finish', () => this.#pushData && this.#pushData())
    }

    _write(chunk, _, cb){
        this.#tail += chunk;
        this._matches.push(...[...this.#tail.matchAll(this._pattern)].map(match => JSON.parse( match[1] )));
        this.#tail = this.#tail.replace(this._pattern, '');

        this.#getMore = cb;

        this.#pushData && this.#pushData();
        this.#pushData = null;
    }

    async _read(){
        while(true){
            if(this._matches.length === 0){
                if(this.writableFinished)
                    return this.push(null);
                
                this.#getMore && setImmediate(this.#getMore);
                this.#getMore = null;
                
                await (new Promise(resolve => this.#pushData = resolve));
                continue;
            }

            if(!this.push(this._getItem())) return;
        }
    }

    _getItem(){
        throw new Error(`_getItem() must be implemented`)
    }
}

export default JSONExtractorStream;