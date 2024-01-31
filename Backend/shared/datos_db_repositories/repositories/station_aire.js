export class StationAireRepository {
  constructor(connection) {
    this.connection = connection
  }

  add = async ({ data }) => {
    await this.connection.execute(
      `INSERT INTO estacion_aire
       SET identificacion = ?,
           codigo = ?,
           latitud  = ?,
           longitud   = ?,
           estado     = ?,
           id_departamento = ?,
           id_propietario     = ?,
           id_operador     = ?`,
      [
        data.identificacion,
        data.codigo,
        data.latitud,
        data.longitud,
        data.estado,
        data.idDepartamento,
        data.idPropietario,
        data.idOperador
      ]
    )
  }

  addMigrationStation = async ({ data }) => {
    this.connection.execute(
      `INSERT INTO station_aire
       SET codigo = ?,
           identificacion = ?,
           latitud  = ?,
           longitud   = ?,
           estado     = ?,
           propietario     = ?,
           operador     = ?`,
      [
        data.id,
        data.est_aire_identificacion,
        data.ubi_coord_y,
        data.ubi_coord_x,
        data.est_aire_activa,
        data.propietario,
        data.operador
      ]
    )
  }

  addMigrationStationReport = async (data, idPeriodo, idStation) => {
    this.connection.execute(
      `INSERT INTO station_report
       SET idPeriodo = ?,
           fecha = ?,
           concentracion  = ?,
           origen = ?,
           id_station = ?`,
      [
        idPeriodo,
        data.med_fecha,
        data.med_concentracion,
        "SIA",
        idStation
      ]
    )
  }

  addMigrationStationPeriodo = async (idStation, periodo) => {
    this.connection.execute(
      `INSERT INTO station_periodo
       SET idStation = ?,
           tipo = ? `,
      [
        idStation,
        periodo
      ]
    )
  }

  addStationPeriodo = async (idStation, idPeriodo) => {
    await this.connection.execute(
      `INSERT INTO estacion_aire_periodo
       SET idEstacion = ?,
           idPeriodo = ? `,
      [
        idStation,
        idPeriodo
      ]
    )
  }

  addStationParameter = async (idStation, idParameter) => {
    await this.connection.execute(
      `INSERT INTO estacion_aire_parametro
       SET idParametro = ?,
           idEstacion = ? `,
      [
        idParameter,
        idStation
      ]
    )
  }

  addStationReport = async (data, idPeriodo, idStation, idParametro) => {
    this.connection.execute(
      `INSERT INTO estacion_aire_medicion
       SET idPeriodo = ?,
           fecha = ?,
           concentracion  = ?,
           idParametro = ?,
           origen = ?,
           idEstacion = ?`,
      [
        idPeriodo,
        data.fecha,
        data.concentracion,
        idParametro,
        "INGRESADO",
        idStation
      ]
    )
  }

  existStation = async (codigo) => {
    const data = await this.connection.query(`SELECT count(codigo) as quantity FROM estacion_aire s WHERE s.codigo = ?`, [codigo])
    return data[0].quantity
  }

  getStation = async (codigo) => {
    const data = await this.connection.query(`SELECT * FROM estacion_aire s WHERE s.codigo = ?`, [codigo])
    return data[0]
  }

  existStationPeriod = async (idStation, idPeriod) => {
    const data = await this.connection.query(`SELECT count(idEstacion) as quantity FROM estacion_aire_medicion s WHERE s.idEstacion = ? and s.idPeriodo = ?`, [idStation, idPeriod])
    return data[0].quantity > 0
  }

  existStationParameter = async (idStation, idParameter) => {
    const data = await this.connection.query(`SELECT count(idEstacion) as quantity FROM estacion_aire_medicion s WHERE s.idEstacion = ? and s.idParametro = ?`, [idStation, idParameter])
    return data[0].quantity > 0
  }

  existStationReport = async (idStation) => {
    const data = await this.connection.query(`SELECT count(idEstacion) as quantity FROM estacion_aire_medicion s WHERE s.idEstacion = ?`, [idStation])
    return data[0].quantity > 0
  }

  getStationReport = async (idStation) => {
    const data = await this.connection.query(`SELECT a.fecha, a.concentracion, a.origen, pm.tipo, p2.nombre_clave as parametro 
    FROM estacion_aire_medicion AS a
    JOIN estacion_aire_periodo AS p ON p.id =  a.idPeriodo
    JOIN periodos_muestra pm ON pm.id = p.idPeriodo 
    JOIN estacion_aire_parametro AS pa ON pa.id = a.idParametro
    JOIN parametro p2 ON p2.id_parametro = pa.idParametro 
    WHERE a.idEstacion = ?
    GROUP BY a.fecha, a.concentracion, a.origen
    ORDER BY a.fecha DESC;`, [idStation])
    return data
  }

  getStationPeriodo = async (idStation, periodo) => {
    const data = await this.connection.query(`SELECT * FROM estacion_aire_periodo s WHERE s.idEstacion = ? and s.idPeriodo = ?`, [idStation, periodo])
    return data[0]
  }

  getStationParameter = async (idStation, parameter) => {
    const data = await this.connection.query(`SELECT * FROM estacion_aire_parametro s WHERE s.idEstacion = ? and s.idParametro = ?`, [idStation, parameter])
    return data[0]
  }

  getPeriodsByStation = async (idStation) => {
    const data = await this.connection.query(`SELECT s.idPeriodo FROM estacion_aire_periodo s WHERE s.idEstacion = ?`, [idStation])
    const periods = data.map((obj) => obj.idPeriodo);
    return periods;
  }

  getParametersByStation = async (idStation) => {
    const data = await this.connection.query(`SELECT s.idParametro FROM estacion_aire_parametro s WHERE s.idEstacion = ?`, [idStation])
    const parameters = data.map((obj) => obj.idParametro);
    return parameters;
  }

  deletePeriodById = async (idPeriod) => {
    const data = await this.connection.query(`DELETE FROM estacion_aire_periodo where id = ?`, [idPeriod])
    return data[0]
  }

  deleteParameterById = async (idParameter) => {
    const data = await this.connection.query(`DELETE FROM estacion_aire_parametro where id = ?`, [idParameter])
    return data[0]
  }

  get = async () => {
    const data = await this.connection.query(`
    SELECT
      ea.id, ea.codigo, ea.identificacion, ea.latitud, ea.longitud, ea.estado,
      JSON_OBJECT('nombre', d.dep_nombre, 'id', d.id_departamento) AS departamento,
      JSON_OBJECT('id', pr.id_institucion, 'nombre', pr.nombre) AS propietario,
      JSON_OBJECT('id', o.id_institucion, 'nombre', o.nombre) AS operador,
      GROUP_CONCAT(DISTINCT p.nombre_clave SEPARATOR ',') AS parametros,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', p.id_parametro, 'nombre', p.nombre_clave)) AS datosParametros,
      GROUP_CONCAT(DISTINCT pm.tipo SEPARATOR ',') AS tipos,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', pm.id, 'tipo', pm.tipo)) AS datosTipos
    FROM estacion_aire ea
      LEFT JOIN estacion_aire_parametro eapm ON ea.id = eapm.idEstacion
      LEFT JOIN estacion_aire_periodo eap ON ea.id = eap.idEstacion
      LEFT JOIN periodos_muestra pm ON eap.idPeriodo = pm.id
      LEFT JOIN parametro p ON eapm.idParametro = p.id_parametro
      LEFT JOIN departamento d ON ea.id_departamento = d.id_departamento
      LEFT JOIN institucion pr ON ea.id_propietario = pr.id_institucion
      LEFT JOIN institucion o ON ea.id_operador = o.id_institucion
    GROUP BY ea.id;
    `);
    return data;
  }

  getInstitutes = async () => {
    const data = await this.connection.query(`SELECT * FROM institucion i`)
    return data;
  }

  getPeriods = async () => {
    const data = await this.connection.query(`SELECT * FROM periodos_muestra p`)
    return data;
  }

  getParameters = async () => {
    const data = await this.connection.query(`SELECT * FROM parametro p WHERE p.id_parametro IN (2014, 2015);`)
    return data;
  }

  update = async ({ data, codigo }) => {
    await this.connection.execute(
      `UPDATE estacion_aire
      SET identificacion = ?,
        estado     = ?,
        id_departamento = ?,
        id_propietario     = ?,
        id_operador     = ? 
      WHERE
       codigo    = ?
       `,
      [
        data.identificacion,
        data.estado,
        data.idDepartamento,
        data.idPropietario,
        data.idOperador,
        codigo
      ]
    )
  }

  deleteAllPeriods = async (idStation) => {
    await this.connection.execute(
      `DELETE FROM estacion_aire_periodo
      WHERE idEstacion = ?
       `,
      [
        idStation
      ]
    )
  }

  deleteAllParameters = async (idStation) => {
    await this.connection.execute(
      `DELETE FROM estacion_aire_parametro
      WHERE idEstacion = ?
       `,
      [
        idStation
      ]
    )
  }

  delete = async (idStation) => {
    await this.connection.execute(
      `DELETE FROM estacion_aire
      WHERE id = ?
       `,
      [
        idStation
      ]
    )
  }

  destroy() {
    this.connection.destroy()
  }

}