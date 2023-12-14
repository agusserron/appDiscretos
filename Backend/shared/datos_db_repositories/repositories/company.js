export class CompanyRepository {
    constructor(connection) {
        this.connection = connection
    }

    addMigration = async ({ data }) => {
        await this.connection.execute(
            `INSERT INTO empresa
                SET nombre  = ?,
                    rut   = ?,
                    emp_descripcion     = ?,
                    emp_telefono     = ?,
                    emp_fax     = ?,
                    emp_direccion     = ?,
                    emp_vigente     = ?,
                    emp_tipo     = ?,
                    mail_contacto1     = ?,
                    mail_contacto2     = ?
           `,
            [
                data.nombre,
                data.rut,
                data.emp_descripcion,
                data.emp_telefono,
                data.emp_fax,
                data.emp_direccion,
                data.emp_vigente,
                data.emp_tipo,
                data.mail_contacto1,
                data.mail_contacto2,
            ]
        )
    }

    add = async ({ data }) => {
        await this.connection.execute(
            `INSERT INTO empresa
                SET nombre  = ?,
                    rut   = ?,
                    emp_direccion     = ?
           `,
            [
                data.nombre,
                data.rut,
                data.direccion
            ]
        )
    }

    existRUTAndName = async (rut, nombre) => {
        const data = await this.connection.query(`select count(rut) as quantity from empresa c where c.rut = ? and c.nombre = ?`, [rut, nombre])
        return data[0].quantity
    }

    existRUT = async (rut) => {
        const data = await this.connection.query(`select cast(count(rut) as SIGNED integer) as quantity from empresa e where e.rut = ?`, [rut])
        return data[0].quantity
    }

    getId = async (rut, nombre) => {
        const data = await this.connection.query(`select c.id from empresa c where c.rut = ? and c.nombre = ?`, [rut, nombre])
        return data[0].id
    }

    getIdByRUT = async (rut) => {
        const data = await this.connection.query(`select c.id from empresa c where c.rut = ?`, [rut])
        return data[0].id
    }

    get = async () => {
        const data = await this.connection.query(`select e.id, e.nombre, e.rut, e.emp_direccion from empresa e`)
        return data
    }

}