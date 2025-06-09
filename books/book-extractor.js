import JSONExtractorStream from '../base-streams/json-extractor-stream.js';

export default class BookExtractorStream extends JSONExtractorStream{
    _getItem(){
        const { key, title, description, authors } = this._matches.shift();
        return { key, title, description, authors };
    }
}