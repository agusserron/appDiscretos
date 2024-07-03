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

}
