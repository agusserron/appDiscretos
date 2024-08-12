const aguaEstacionSchema = {
    type: 'object',
    properties: {
        codigo: { type: 'string' },
        nombre: { type: 'string' },
        latitud: { type: 'string' },
        longitud: { type: 'string' },
        idPrograma: { type: 'number' },
        version:  { type: 'number' },
        id_tipo_punto: { type: 'number' },
        id_departamento: { type: 'number' },
        id_sub_cuenca: { type: 'number' },
        orden_ingreso: { type: 'number' },
        ingreso_interno: { type: 'number' },
        id_matriz: { type: 'number' },
    },
    required: ['codigo', 'nombre', 'matriz']
};

export default {
    aguaEstacionSchema
}