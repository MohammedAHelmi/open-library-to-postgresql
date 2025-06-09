export default function mergeSchemas(s1, s2){
    if(s1 == null || s2 == null){
        const schema = s1 ?? s2;
        if(!schema.type.includes("undefined"))
            schema.type.push("undefined");
        return schema;
    }

    const schema = {};

    schema.type = mergeTypes(s1.type, s2.type);
    
    if(s1.type.includes('array') && s2.type.includes('array'))
        schema.items = mergeSchemas(s1.items, s2.items);
    else if(schema.type.includes('array'))
        schema.items = s1.items ?? s2.items;
    
    if(s1.type.includes('object') && s2.type.includes('object'))
        schema.properties = mergeProperties(s1.properties, s2.properties);
    else if(schema.type.includes('object'))
        schema.properties = s1.properties ?? s2.properties;
    
    return schema;
}

function mergeTypes(t1, t2) {
    const type = new Set([...t1, ...t2]);
    return [...type];
}

function mergeProperties(p1, p2) {
    if(p1 == null || p2 == null)
        return p1 ?? p2;

    const properties = {};
    const propertiesNames = new Set([...Object.keys(p1), ...Object.keys(p2)]);
    for(const propertyName of propertiesNames)
        properties[propertyName] = mergeSchemas(p1[propertyName], p2[propertyName]);
    return properties;
}