export class ProgramRepository {
    constructor(connection) {
        this.connection = connection
    }
    
    //inactiva
    inactiveProgram = async (idProgram) => {
        const query = `
            UPDATE programa
            SET estado = 0
            WHERE id_programa = ?
        `;
        const result = await this.connection.query(query, [idProgram]);
        return result[0];
      }

      countByCodigo = async (codigo) => {
        
        const query = `
          SELECT * 
          FROM programa
          WHERE codigo_programa = ?
        `;
           
        const result = await this.connection.execute(query, [codigo]);     
        return result[0];  
      };
    
    
      countByNombre = async (nombre) => {
    
        const query = `
          SELECT * 
          FROM programa
          WHERE nombre_programa = ?
        `;
        
        const result = await this.connection.execute(query, [nombre]);     
        return result[0]; 
      };
    
     
      addProgram = async ({ data, visibleExternos, version = 0, id_programa_silad =0, estado, parametros}) => {
        await this.connection.beginTransaction();
        const result  = await this.connection.execute(
         `INSERT INTO programa 
          SET  nombre_programa = ?,
            codigo_programa = ?, 
            visible_externos = ?, 
            version = ?, 
            id_programa_silad = ?,
            estado = ?
          `,
         [
          data.nombre,
          data.codigo,
          visibleExternos,
          version, 
          id_programa_silad, 
          estado,
          'INGRESADO'
        ]
      );

      const programaId = result.insertId;
      if (Array.isArray(parametros)) {
          for (let index = 0; index < parametros.length; index++) {
              await this.connection.execute(
                  `INSERT INTO programa_parametro
                   SET id_programa = ?,
                       id_parametro = ?`,
                  [
                      programaId,
                      parametros[index].id_parametro  
                  ]
              );
          }
      }
    await this.connection.commit();
    return programaId;
    }

    getParamProgram = async (idProgram) => {
    
      const query = `
        SELECT p.*
        FROM programa_parametros pp
        JOIN parametros p ON pp.id_parametro = p.id
        WHERE pp.id_programa = ?
      `;
      
      const result = await this.connection.execute(query, [idProgram]);     
      return result[0]; 
    };

}
