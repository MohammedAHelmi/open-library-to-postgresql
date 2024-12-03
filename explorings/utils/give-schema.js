import mergeSchemas from "./merge-schemas.js";

const getItemsSchema = (obj) => {
    let items = obj.length ? giveSchema(obj[0]) : {};
    
    for(let i = 1; i < obj.length; i++)
        items = mergeSchemas(items, giveSchema(obj[i]));

    return items;
}

const getPropertiesSchema = (obj) => {
    const properties = {};

    Object.entries(obj).forEach( ([key, value]) => properties[key] = giveSchema(value) );

    return properties;
}

function giveSchema(obj){
    const schema = {};

    schema.type = obj instanceof Array ? 'array': typeof obj;

    if(schema.type === 'array')
        schema.items = getItemsSchema(obj);
    
    if(schema.type === 'object')
        schema.properties = getPropertiesSchema(obj);

    return schema;
}

export default giveSchema;