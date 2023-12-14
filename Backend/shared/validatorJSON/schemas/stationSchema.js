const stationSchema = {
    type: 'object',
    properties: {
        identificacion: { type: 'string' },
        codigo: { type: 'string' },
        latitud: { type: 'string' },
        longitud: { type: 'string' },
        estado: { type: 'boolean' },
        idDepartamento: { type: 'number' },
        parametros: { type:"array", items : { type : 'number'}, minItems: 1 },
        idPropietario: { type: 'number' },
        idOperador: { type: 'number' },
        periodos: { type:"array", items : { type : 'number'}, minItems: 1 }
    },
    required: ['identificacion', 'codigo', 'latitud', 'longitud', 'estado', 'idDepartamento', 'parametros', 'idPropietario', 'idOperador', 'periodos']
};

const stationReportSchema = {
    type: 'object',
    properties: {
        tipoPeriodo: { type: 'number' },
        parametro: { type: 'number' },
        fecha: { type: 'string',},
        concentracion: { type: 'number' },
        station: { type: 'object' }
    },
    required: ['tipoPeriodo', 'fecha', 'concentracion', 'station', 'parametro']
};


export default {
    stationSchema,
    stationReportSchema
}

