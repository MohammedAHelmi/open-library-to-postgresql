export default class InsertBuilder{
    #table
    #columns
    #values
    #onConflict = '';
    
    /**
     * 
     * @param {string} table 
     * @returns {InsertBuilder}
    */
   table(table){
       this.#table = table
       return this;
    }
    
    /**
     * 
     * @param {string[]} columns 
     * @returns {InsertBuilder}
    */
   columns(columns){
       this.#columns = columns;
       return this;
    }
    
    /**
     * 
     * @param {object[]} values
     * @returns {InsertBuilder} 
    */
    values(values){
       this.#values = values;
       return this;
    }
    
    /**
     * 
     * @returns {InsertBuilder}
     */
    onConflictDoNothing(){
        this.#onConflict = ` ON CONFLICT DO NOTHING`;
        return this;
    }
    
    build(){
        if(typeof this.#table !== 'string')
            throw new Error("Invalid Table");
        if(!(this.#columns instanceof Array))
            throw new Error("Invalid Columns");
        if(!(this.#values instanceof Array))
            throw new Error("Invalid Values");
        
        if(this.#values.length === 0)
            return ['', []];
        
        const query = this.#constructQuery();
        const values = this.#values.flatMap(rowData => this.#extractValues(rowData));
        return [query, values];
    }
    
    #constructQuery(){
        const insertStatement = `INSERT INTO ${this.#table} (${this.#columns.join(', ')}) VALUES `;
        return insertStatement + this.#constructValuesStatement() + this.#onConflict + ';' ;
    }

    #constructValuesStatement(){
        const rowStatements = [];
        for(let i = 0; i < this.#values.length; i++)
            rowStatements.push(this.#constructRowStatement(i*this.#columns.length));
        return rowStatements.join(', ');
    }
    
    #constructRowStatement(offset){
        const fields = [];
        for(let i = 1; i <= this.#columns.length; i++)
            fields.push(`$${i+offset}`);
        return `(${ fields.join(', ') })`;
    }

    #extractValues(rowData){
        return this.#columns.map(columnName => rowData[columnName]);
    }
}