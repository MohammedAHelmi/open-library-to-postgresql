import JSONExtractorStream from '../base-streams/json-extractor-stream.js';

class AuthorExtractorStream extends JSONExtractorStream{
    _getItem(){
        const { key, name, bio } = this._matches.shift();
        return { key, name, bio };
    }
}

export default AuthorExtractorStream;