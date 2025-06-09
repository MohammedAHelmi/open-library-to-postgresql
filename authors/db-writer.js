import DBWriter from '../base-streams/db-writer.js';


class AuthorsDBWriter extends DBWriter{
    _handleChunk(chunk){
        let { key, name, bio } = chunk;

        if(name == null)
            return;
        
        if(typeof bio === 'object')
            bio = bio.value;

        this._dataBatch.push({ openlibrary_key: key, name, bio });
    }
}

export default AuthorsDBWriter;