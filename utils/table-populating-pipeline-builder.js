import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import DBWriter from '../base-streams/db-writer.js';
import JSONExtractorStream from "../base-streams/json-extractor-stream.js";

class TablePopulatingPipelineBuilder{
    #inputFilePath;
    #extractorStream;
    #dbWriter;

    setFilePath(filePath){
        this.#inputFilePath = filePath;
        return this
    }

    setExtractorStream(extractorStream){
        this.#extractorStream = extractorStream;
        return this;
    }

    setDBWriter(dbWriter){
        this.#dbWriter = dbWriter;
        return this;
    }

    #verifyConstructs(){
        if(typeof this.#inputFilePath !== 'string')
            throw new Error(`Expected file path to be a string`)
    
        if(!(this.#extractorStream instanceof JSONExtractorStream))
            throw new Error(`Expected extractor stream to be an instance of JSONExtractorStream`);

        if(!(this.#dbWriter instanceof DBWriter))
            throw new Error(`Expected dbWriter to be an instance of DBWriter`);

        return true;
    }


    getPipeline(){
        this.#verifyConstructs();
        return pipeline(
            createReadStream(this.#inputFilePath),
            this.#extractorStream,
            this.#dbWriter
        );
    }
}

export default TablePopulatingPipelineBuilder;