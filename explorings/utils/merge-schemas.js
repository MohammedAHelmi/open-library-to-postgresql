const copyTheNotNull = (obj1, obj2) => {
    const obj = obj1 ?? obj2;
    return obj != null? {...obj} : null;
}

const mergeTypes = (type1, type2) => {
    const types = new Set();

    for(const type of [type1, type2]){
        if(typeof type === 'string')
            types.add(type)
        
        if(type instanceof Array)
            type.forEach(type => types.add(type));
    }

    const mergedType = [...types];
    return mergedType.length === 1? mergedType[0]: mergedType;
}

const mergeProperties = (properties1, properties2) => {
    if(properties1 == null || properties2 == null)
        return copyTheNotNull(properties1, properties2);

    const properties = {};
    
    const propertiesNames = new Set([...Object.keys(properties1), ...Object.keys(properties2)]);

    for(const propertyName of propertiesNames)
        properties[propertyName] = mergeSchemas(properties1[propertyName], properties2[propertyName]);

    return properties;
}

function mergeSchemas(schema1, schema2){
    if(schema1 == null || schema2 == null)
        return copyTheNotNull(schema1, schema2)

    const schema = {};

    schema.type = mergeTypes(schema1.type, schema2.type);
    
    if(schema.type === 'array' || schema.type.includes('array'))
        schema.items = mergeSchemas(schema1.items, schema2.items);

    if(schema.type === 'object' || schema.type.includes('object'))
        schema.properties = mergeProperties(schema1.properties, schema2.properties);

    return schema;
}

export default mergeSchemas;