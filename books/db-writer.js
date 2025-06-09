import DBWriter from '../base-streams/db-writer.js';

export default class BooksDBWriter extends DBWriter{
    _handleChunk(chunk){
        let { title, description, key } = chunk;

        if(title == null)
            return;
        
        if(typeof description === 'object')
            description = description.value;

        this._dataBatch.push({ openlibrary_key: key, title, description })
    }
}