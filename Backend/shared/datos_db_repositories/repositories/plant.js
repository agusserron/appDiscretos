export class PlantRepository {
    constructor(connection) {
        this.connection = connection
    }

    add = async ({ data, idEmpresa, idDepartamento }) => {
        this.connection.execute(
            `INSERT INTO planta
       SET nombre     = ?,
           nroEnlace    = ?,
           direccion     = ?,
           longitud     = ?,
           latitud    = ?,
           idDepartamento     = ?,
           localidad     = ?,
           monitoreoAtmosfera = ?,
           idEmpresa = ?
           `,
            [
                data.pla_nombre,
                data.pla_nro_enlace,
                data.pla_direccion,
                data.pla_longitud,
                data.pla_latitud,
                idDepartamento,
                data.pla_localidad,
                data.pla_monitoreo_atmosfera,
                idEmpresa
            ]
        )
    }

    addPlant = async ({ data }) => {
        this.connection.execute(
            `INSERT INTO planta
       SET nombre     = ?,
           nroEnlace    = ?,
           direccion     = ?,
           idDepartamento     = ?,
           idEmpresa = ?
           `,
            [
                data.nombre,
                data.nroEnlace,
                data.direccion,
                data.idDepartamento,
                data.idEmpresa
            ]
        )
    }

    existPlant = async (idEmpresa, nombre, nroEnlace) => {
        const data = await this.connection.query(`select count(nombre) as quantity from planta p where p.idEmpresa = ? and p.nombre = ? and p.nroEnlace = ?`
            , [idEmpresa, nombre, nroEnlace])
        return data[0].quantity
    }

    get = async (nroEnlace) => {
        const data = await this.connection.query(`select *, d.dep_nombre as departamento from planta p, departamento d where p.nroEnlace = ? and p.idDepartamento = d.id_departamento`, [nroEnlace])
        return data[0]
    }

    existNroEnlace = async (nroEnlace) => {
        const data = await this.connection.query(`select exists(select * from planta p WHERE p.nroEnlace = ?) AS result;`, [nroEnlace])
        return data[0].result
    }

    getNroEnlaces = async (nombre) => {
        const data = await this.connection.query(`SELECT p.nroEnlace FROM planta p, empresa c WHERE p.idEmpresa = c.id and c.nombre = ? and p.nroEnlace != 0 order by p.nroEnlace asc;`
            , [nombre])
        return data
    }

    getAllNroEnlaces = async () => {
        const data = await this.connection.query(`select p.nroEnlace from planta p where p.nroEnlace != 0;`)
        return data
    }

    getIdByEmpresa = async (idCompany) => {
        const data = await this.connection.query(`select p.id from planta p where p.idEmpresa = ?`, [idCompany])
        return data[0].id
    }

    getAllPlants = async () => {
        const data = await this.connection.query(`select p.id, p.nombre, p.nroEnlace, d.dep_nombre as departamento, p.direccion, c.nombre as nombreEmpresa from planta p, empresa c, departamento d 
        where p.idEmpresa = c.id and p.idDepartamento = d.id_departamento`)
        return data
    }

    getViewDepartament = async () => {
        const data = await this.connection.query(`select * from vista_departamentos`)
        return data
    }

    getDepartamentId = async (nombre) => {
        const data = await this.connection.query(`select d.id_departamento from departamento d where d.dep_nombre = ?`, [nombre])
        return data[0].id_departamento
    }

 }
