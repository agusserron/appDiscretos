export class PresentaIAORepository {
    constructor(connection) {
        this.connection = connection
    }

    add = async ({ data, idPlant }) => {
        this.connection.execute(
            `INSERT INTO presenta_iao
       SET cursos     = ?,
           atmosfera    = ?,
           calidadAire     = ?,
           tipoIAO     = ?,
           idPlant    = ?
           `,
            [
                data.det_pre_iao_monitoreo_cursos,
                data.det_pre_iao_monitoreo_atmos,
                data.det_pre_iao_monitoreo_calidadaire,
                data.tip_pre_iao_nombre,
                idPlant
            ]
        )
    }

    existIdPlant = async (idPlant) => {
        const [data, _] = await this.connection.query(`select exists(select * from presenta_iao p WHERE p.idPlant = ?) AS result;`, [idPlant])
        return data[0].result
    }

    update = async ({ data, idPlant }) => {
        this.connection.execute(
            `UPDATE presenta_iao
        SET cursos     = ?,
           atmosfera    = ?,
           calidadAire     = ?,
           tipoIAO     = ?
        WHERE
           idPlant    = ?
           `,
            [
                data.det_pre_iao_monitoreo_cursos,
                data.det_pre_iao_monitoreo_atmos,
                data.det_pre_iao_monitoreo_calidadaire,
                data.tip_pre_iao_nombre,
                idPlant
            ]
        )
    }

    destroy() {
        this.connection.destroy()
    }

}
