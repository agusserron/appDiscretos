export class AireRepository {
  constructor(connection) {
    this.connection = connection
  }

  add = async ({ data }) => {
    await this.connection.execute(
      `INSERT INTO monitoreo_calidad_aire_iao
       SET nombrePunto = ?,
           latitud  = ?,
           longitud   = ?,
           fechaInicio     = ?,
           fechaFin     = ?,
           idParametro     = ?,
           idUnidad     = ?,
           valor     = ?,
           metodologia     = ?,
           frecuencia     = ?,
           equipo     = ?,
           tipoMonitoreo     = ?,
           valorMaximo     = ?,
           observaciones     = ?,
           estado     = ?,
           idPlant     = ?, 
           origen = ? `,
      [
        data.nombrePunto,
        data.latitud,
        data.longitud,
        data.fechaInicio,
        data.fechaFin,
        data.idParametro,
        data.idUnidad,
        data.valor,
        data.metodologia,
        data.frecuencia,
        data.equipo,
        data.tipoMonitoreo,
        data.valorMaximo,
        data.observaciones,
        data.estado,
        data.idPlant,
        'INGRESADO'
      ]
    )
  }

  addMigrationReport = async ({ data, idPlant, idParametro, idUnidad }) => {
    await this.connection.execute(
      `INSERT INTO monitoreo_calidad_aire_iao
       SET nombrePunto = ?,
           latitud  = ?,
           longitud   = ?,
           fechaInicio     = ?,
           fechaFin     = ?,
           idParametro     = ?,
           idUnidad     = ?,
           valor     = ?,
           metodologia     = ?,
           frecuencia     = ?,
           equipo     = ?,
           tipoMonitoreo     = ?,
           valorMaximo     = ?,
           observaciones     = ?,
           estado     = ?,
           idPlant     = ?,
           origen = ?   `,
      [
        data.pun_mon_cal_air_iao_identificacion,
        data.pun_mon_cal_air_iao_coord_y,
        data.pun_mon_cal_air_iao_coord_x,
        data.res_mon_cal_fecha_muestreo,
        data.res_mon_cal_fecha_muestreo_fin,
        idParametro,
        idUnidad,
        data.res_mon_cal_valor_discreto,
        data.res_mon_cal_metodologia_muestreo,
        "",
        "",
        data.tip_mon_emi_nombre,
        data.res_mon_cal_maxima,
        "",
        0,
        idPlant,
        'SIA'
      ]
    )
  }

  existReport = async (data) => {
    const { valor, fechaInicio, fechaFin, idPlant, nombrePunto } = data;
    const result = await this.connection.query(`select count(idPlant) as quantity from monitoreo_calidad_aire_iao a where a.valor = ? and a.fechaInicio = ? and a.fechaFin = ? and a.idPlant = ? and a.nombrePunto = ?`
      , [valor, fechaInicio, fechaFin, idPlant, nombrePunto])
    return result[0].quantity
  }

  getReport = async (idPlant) => {
    const data = await this.connection.query(`select a.id, a.nombrePunto, a.latitud, a.longitud, a.fechaInicio ,a.fechaFin, a.valor, a.metodologia , a.frecuencia, a.equipo 
    ,a.tipoMonitoreo, a.valorMaximo , a.observaciones , 
    a.origen, p.nroEnlace, p.nombre, plc.par_nombre_clave as parametro, u.uni_nombre as unidad  
    from monitoreo_calidad_aire_iao a, unidad u, parametro_lista_control plc, planta p  where a.idPlant = ? and a.idPlant = p.id and a.idUnidad = u.id_unidad 
    and a.idParametro = plc.id 
    order by a.fechaInicio desc`, [idPlant])
    return data
  }

  getReportByCity = async (city) => {
    const data = await this.connection.query(`SELECT a.id, a.nombrePunto, a.latitud, a.longitud, a.fechaInicio ,a.fechaFin, a.valor, a.metodologia , 
    a.frecuencia, a.equipo , a.tipoMonitoreo, a.valorMaximo , a.observaciones , 
    a.origen, p.nroEnlace, p.nombre, plc.par_nombre_clave as parametro, u.uni_nombre as unidad 
    FROM planta as p, monitoreo_calidad_aire_iao as a, departamento as d, parametro_lista_control plc, unidad u  
    WHERE p.idDepartamento = d.id_departamento AND p.id = a.idPlant AND d.dep_nombre = ? AND a.idParametro = plc.id  
    AND a.idUnidad  = u.id_unidad 
    order by a.fechaInicio desc`, [city])
    return data
  }

  getParameters = async () => {
    const data = await this.connection.query(`select * from vista_parametros_aire vpa`)
    return data
  }

  getUnits = async () => {
    const data = await this.connection.query(`select * from vista_unidades_aire vua`)
    return data
  }

  // AGUS
  getNombresPuntos = async (empresaId) => {
    try {
      const nombresPuntos = await this.connection.query(
        `SELECT DISTINCT mca.nombrePunto
       FROM monitoreo_calidad_aire_iao AS mca
       JOIN planta AS p ON mca.idPlant = p.id
       WHERE p.idEmpresa = ?`,
      [empresaId],
      );
    return nombresPuntos;
    } catch (error) {
      console.error('Error en getNombresPuntos:', error);
      throw new Error('Error al obtener los nombres de puntos.');
    }
  };

  
  getLatLongPunto = async (nombrePuntoParam) => {
    const data = await this.connection.query(`select mca.latitud, mca.longitud , mca.nombrePunto from monitoreo_calidad_aire_iao mca where mca.nombrePunto = ? LIMIT 1`, [nombrePuntoParam])
    return data
  }

 

  //


  getUnitId= async (nombre) => {
    const data = await this.connection.query(`select u.id_unidad from unidad u where u.uni_nombre = ?`, [nombre])
    return data[0].id_unidad
  }

  getParameterId= async (nombre) => {
    const data = await this.connection.query(`select p.id from parametro_lista_control p where p.par_nombre = ?`, [nombre])
    return data[0].id
  }

}