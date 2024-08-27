export class InstitucionesRepository {
   constructor(connection) {
    this.connection = connection
  }

  addInstituciones = async ({ data }) => {
    await this.connection.execute(
      `INSERT INTO institucion
       SET nombre = ?,
           estado     = ?`,
      [
        data.nombre,
        data.estado
      ]
    )
  }


  getInstituciones = async () => {
    const data = await this.connection.query(`select * from institucion`);
    return data;
  }

    //inactiva
    desactivarInst = async (idInst) => {
      const query = `
          UPDATE institucion
          SET estado = 0
          WHERE id_institucion = ?
      `;
      const result = await this.connection.query(query, [idInst]);
      return result[0];
    }


    //actualizar

    actualizarInst = async (data) => {
      const query = 
        `UPDATE institucion
        SET nombre     = ?,
          estado = ? 
        WHERE
         id_institucion = ?
         `;
         const result = await this.connection.query(query, [data.nombre, data.estado, data.id_institucion]);
         return result[0];
      
    }
}