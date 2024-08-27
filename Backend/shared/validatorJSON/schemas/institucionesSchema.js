const institucionesSchema = {
    type: 'object',
    properties: {
        id_institucion: { type: 'number' },
        nombre: { type: 'string' },
        estado: { type: 'string' }
    },
    required: ['nombre', 'estado']
};

export default {
    institucionesSchema
}
