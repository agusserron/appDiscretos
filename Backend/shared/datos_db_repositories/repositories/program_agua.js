export class ProgramRepository {
    constructor(connection) {
        this.connection = connection
    }
    
    //inactiva
    deleteProgram = async (codigo) => {
        const query = `
            UPDATE programa
            SET estado = ?
            WHERE id_programa = ?
        `;
        const result = await this.connection.query(query, ['Inactivo']);
        return result[0];
      }

}
