const aireSchema = {
    type: 'object',
    properties: {
        nombrePunto: { type: 'string' },
        latitud: { type: 'string' },
        longitud: { type: 'string' },
        fechaInicio: { type: 'string' },
        fechaFin: { type: 'string' },
        idParametro: { type: 'number' },
        idUnidad: { type: 'number' },
        valor: { type: 'number' },
        metodologia: { type: 'string' },
        frecuencia: { type: 'string' },
        equipo: { type: 'string' },
        tipoMonitoreo: { type: 'string' },
        valorMaximo: { type: ['number', 'null'] },
        observaciones: { type: 'string' },
        estado: { type: 'number' },
        idPlant: { type: 'number' }
    },
    required: ['nombrePunto', 'latitud', 'longitud', 'fechaInicio', 'fechaFin', 'idParametro', 'idUnidad', 'valor', 'metodologia', 'frecuencia', 'equipo',
    'tipoMonitoreo', 'valorMaximo', 'observaciones', 'estado', 'idPlant'
    ]
};

export default {
    aireSchema
}
