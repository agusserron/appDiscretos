const plantSchema = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        nroEnlace: { type: 'number' },
        direccion: { type: 'string' },
        idDepartamento: { type: 'number' },
        idEmpresa: { type: 'number' }
    },
    required: ['nombre', 'nroEnlace', 'direccion', 'idDepartamento', 'idEmpresa']
};

export default {
    plantSchema
}
