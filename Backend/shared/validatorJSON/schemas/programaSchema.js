const programaSchema = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        codigo: { type: 'string' },
        visible: { type: 'number' },
        version: { type: 'number' },
        parametros: { 
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    option: { type: 'string' },
                    color: { type: 'string' },
                    id_parametro: { type: 'number' }
                },           
            }
        }
    },
    required: ['codigo', 'nombre']
};

export default {
    programaSchema
}