import DBWriter from '../base-streams/db-writer.js';

class AuthorsDBWriter extends DBWriter{
    async _write(chunk, _, cb){
        let { name, bio, key } = chunk;

        if(name == null)
            return cb();

        if(typeof bio === 'object')
            bio = bio.value;

        
        await this._getAllocation();

        this._executeQuery(`INSERT INTO authors (name, bio, openlibary_key) VALUES ($1, $2, $3);`, [name, bio, key])
        .then(this._releaseAllocation.bind(this))
        .catch((err) => {
            console.error(err);
            this._releaseAllocation();
        });

        cb();
    }
}

export default AuthorsDBWriter;