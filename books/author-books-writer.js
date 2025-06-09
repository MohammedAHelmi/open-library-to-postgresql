import DBWriter from '../base-streams/db-writer.js';

export default class BookAuthorsDBWriter extends DBWriter{
    _handleChunk(chunk){
        let { key, authors } = chunk;
        
        if(authors == null)
            return;

        authors = authors.filter(author => author.author != null)

        authors = authors.map(author => {
            author = author.author
            return typeof author === 'object'? author.key: author
        });
        
        authors = Array.from(new Set(authors));
        for(const author of authors){
            this._dataBatch.push({ author_key: author, book_key: key });
        }
    }
}