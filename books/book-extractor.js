import JSONExtractorStream from '../base-streams/json-extractor-stream.js';

class BookExtractorStream extends JSONExtractorStream{
    _getItem(){
        const { title, description, authors} = this._matches.shift();
        return { title, description, authors };
    }
}

export default BookExtractorStream;