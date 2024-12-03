import DBWriter from '../base-streams/db-writer.js';

class BooksDBWriter extends DBWriter{
    async #insertAuthor(bookId, author){
        const { rows } = await this._executeQuery(`SELECT id FROM authors WHERE openlibary_key=$1`, [author]);
        if(rows.length === 0)
            return;
        
        const authorId = rows[0].id
        
        this._executeQuery(`INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`, [bookId, authorId])
        .catch(err => {
            if(err.code === '23505') //duplicate record
                return
            console.error(err);
        })
    }
    async #insertAuthors(bookId, authors){
        if(authors == null)
            return;
        
        for(let author of authors){
            author = author.author;

            if(author == null)
                continue;
            
            if(typeof author === 'object')
                author = author.key;

            await this.#insertAuthor(bookId, author);
        }
    }

    async _write(book, _, cb){
        let { title, description, authors } = book;
        
        if(title == null)
            return cb();

        await this._getAllocation();

        cb();
        
        if(typeof description === 'object')
            description = description.value;

        const { rows } = await this._executeQuery(`INSERT INTO books (title, description) VALUES ($1, $2) RETURNING *`, [title, description]);
        await this.#insertAuthors(rows[0].id, authors);
        this._releaseAllocation();
    }
}

export default BooksDBWriter;