export class AguaRepository {
    constructor(connection) {
      this.connection = connection
    }
  
    add = async ({ data }) => {
      this.connection.execute(
        `INSERT INTO datos_agua
         SET is_num = ?,
         id_programa  = ?,
         id_estacion   = ?,
         id_matriz     = ?,
         id_parametro     = ?,
         id_unidad     = ?,
         valor_minimo_str     = ?,
         limite_deteccion     = ?,
         limite_cuantificacion     = ?,
         nro_muestra_origen     = ?,
         campania     = ?,
         fecha_hora     = ?,
         observaciones     = ?,
         replica     = ?,
         nombre_programa     = ?,
         nombre_estacion     = ?, 
         nombre_parametro = ?,
         nombre_unidades = ?,
         nombre_matriz = ? 
          `,
        [
          data[0],
          data[1],
          data[2],
          data[3],
          data[4],
          data[5],
          data[6],
          data[7],
          data[8],
          data[9],
          data[10],
          data[11],
          data[12],
          data[13],
          data[14],
          data[15],
          data[16],
          data[17],
          data[18]
        ]
      )
    }

    get = async () => {
        const data = await this.connection.query(`select * from datos_agua`);
        return data;
    }

    getParametros = async () => {
      const data = await this.connection.query(`select * from parametro`);
      return data;
    }

    getMatrices = async () => {
      const data = await this.connection.query(`select * from matriz`);
      return data;
    }

    getParametrosUnidades = async () => {
      const data = await this.connection.query(`select * from param_unidad`);
      return data;
    }

    getUnidades = async () => {
      const data = await this.connection.query(`select * from unidad`);
      return data;
    }

    getProgramas = async () => {
      const data = await this.connection.query(`select * from programa`);
      return data;
    }

    getInstituciones = async () => {
      const data = await this.connection.query(`select * from institucion`);
      return data;
    }
  
    getDepartamentos = async () => {
      const data = await this.connection.query(`select * from departamento`);
      return data;
    }

    getMuestras = async () => {
      const data = await this.connection.query(`select * from muestra`);
      return data;
    }

    getEnumerados = async () => {
      const data = await this.connection.query(`select * from enumerado`);
      return data;
    }
   

    getEstaciones = async () => {
      const data = await this.connection.query(`select * from estacion`);
      return data;
    }

    getEstacionesPrograma = async (programId) => {
      const query = `
      SELECT 
      e.*
      FROM estacion e
      WHERE e.id_programa = ?
      `;    
      const data = await this.connection.query(query, [programId]);
      return data;
    }

    existeEstacion = async (codigo, nombre) => {

      let query = `
      SELECT *
      FROM estacion
      WHERE estacion = ? OR descripcion = ?
      `;

    const result = await this.connection.execute(query, [codigo, nombre]);
    return result[0];
  
  };

  addStationAgua = async ( data ) => {
      await this.connection.execute(
        `INSERT INTO estacion
         SET estacion = ?,
             descripcion = ?,
             latitud = ?,
             longitud = ?,
             gid = ?,
             id_programa = ?,
             version = ?,
             id_tipo_punto = ?,
             id_departamento = ?,
             id_sub_cuenca = ?,
             orden_ingreso = ?,
             ingreso_interno = ?,
             id_matriz = ?,
             estacion_activa = ?`,
        [
            data.codigo,
            data.nombre,
            data.latitud,
            data.longitud,
            0,
            data.idPrograma,          
            data.version,            
            data.id_tipo_punto,     
            data.id_departamento,
            data.id_sub_cuenca,
            0,    
            data.ingreso_interno,    
            data.id_matriz,
            1
        ]
    );
}




    getTipoPuntoEstacion = async () => {
      const data = await this.connection.query(`select * from tipo_punto_estacion`);
      return data;
    }
    
    getSubcuencaByLatLong = async (lat, long) => {
      const query = `
        SELECT *
        FROM sub_cuenca 
        WHERE ST_Contains(the_geom, ST_GeomFromText('POINT(${long} ${lat})', 4326))
      `;
      const [rows] = await this.connection.query(query);
      return rows;
    };


    getCuencaId = async (nroCuenca) => {
      const query = `
      SELECT c.*
      FROM cuenca c
      WHERE c.id = ?
      `;    
      const data = await this.connection.query(query, [nroCuenca]);
      return data;
    }

    getProgramasParametros = async () => {
      const data = await this.connection.query(`select * from programa_parametro`);
      return data;
    }

    getCodigosSiladParametros = async () => {
      const data = await this.connection.query(`select * from cod_silad_param`);
      return data;
    }
  
    getGruposParametros = async () => {
      const data = await this.connection.query(`select * from grupo_parametro`);
      return data;
    }

    getRangosNormales = async () => {
      const data = await this.connection.query(`select * from rangos_normales`);
      return data;
    }

    getRangosParametros= async () => {
      const data = await this.connection.query(`select * from rango_param`);
      return data;
    }

    getRangosParametrosSitios= async () => {
      const data = await this.connection.query(`select * from rango_param_sitio`);
      return data;
    }

    getParametrosAgua= async () => {
      const data = await this.connection.query(`SELECT p.parametro AS param_nombre,
        p.nombre_clave AS param_nomclave, pu.id_matriz, pu.id_unidad, 
        CASE WHEN p.enumerado = 1 THEN 'SI' ELSE 'NO' END AS param_enum, pu.id_parametro,
        (SELECT GROUP_CONCAT(CONCAT(matriz.nombre, ' (', unidad.uni_nombre, ')') SEPARATOR '; ') AS suma FROM param_unidad 
        JOIN matriz ON param_unidad.id_matriz = matriz.id_matriz JOIN unidad ON param_unidad.id_unidad = unidad.id_unidad WHERE param_unidad.id_parametro = pu.id_parametro) AS matriz_detalle 
        FROM parametro p LEFT JOIN param_unidad pu ON p.id_parametro = pu.id_parametro WHERE pu.id_unidad > 0 AND pu.id_matriz > 0 
        GROUP BY parametro ORDER BY parametro ASC`);
      return data;
    }



  }