import mergeSchemas from "./merge-schemas.js";

export default function giveSchema(obj){
    const schema = {};

    schema.type = obj instanceof Array ? ['array']: [typeof obj];

    if(schema.type[0] === 'array')
        schema.items = getItemsSchema(obj);

    if(schema.type[0] === 'object')
        schema.properties = getPropertiesSchema(obj);
    
    return schema;
}

function getItemsSchema(obj) {
    let items = obj.length ? giveSchema(obj[0]) : {};

    for(let i = 1; i < obj.length; i++)
        items = mergeSchemas(items, giveSchema(obj[i]));

    return items;
}

function getPropertiesSchema(obj) {
    return Object.entries(obj).reduce( (properties, [key, value]) => { 
        properties[key] = giveSchema(value)
        return properties;
    }, {} );
}