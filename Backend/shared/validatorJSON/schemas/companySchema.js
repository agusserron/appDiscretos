const companySchema = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        rut: { type: 'string' },
        direccion: { type: 'string' },
    },
    required: ['nombre', 'rut', 'direccion']
};

export default {
    companySchema
}
