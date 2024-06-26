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

    getTipoPuntoEstacion = async () => {
      const data = await this.connection.query(`select * from tipo_punto_estacion`);
      return data;
    }

    getSubcuencaByLatLong = async (lat, long) => {
      const query = `
          SELECT subcuenca 
          FROM sub_cuenca 
          WHERE ST_Contains(geom, POINT(?, ?))
      `;
      const [rows] = await this.connection.query(query, [lat, long]);
      return rows;
  };



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
  }