import { InstitucionesRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import schemas from "../../shared/validatorJSON/schemas/institucionesSchema.js";
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import validator from "../../shared/validatorJSON/validateJson.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();

const institucionesRepository = new InstitucionesRepository(connection) 

const getInstituciones = async (req,res) => { //tecnicamente la podría sacar de cualquier lado que tuviese el getisntituciones. uso el de AguaRepository porque ya lo tengo
    try {
        const instituciones = await institucionesRepository.getInstituciones({});
        logInfo(`GET getInstituciones from database`);
        res.status(200).json(instituciones);
    } catch (e) {
        logError(`Error getInstituciones/${e}`);
        res.status(500).json({ message: "Error, obteniendo las Instituciones." });
    } finally {
        release();
    }
}


const addInstitucionData = async (req, res) => {
    let data = req.body

    console.log("Datos: ", data);


    if (sanitizer.containsXSS(data)) {
        return res.status(400).json({ message: "Error en sintáxis" });
    }    
    if (!validator.validateJson(data, schemas.institucionesSchema)) {
        return res.status(400).json({ message: "Error en sintaxis" });
    }

    try {
        await institucionesRepository.addInstituciones({ data });
        logInfo(`POST addInstitucionData`);
        res.status(201).json({ message: "Institucion agregada correctamente" });
    } catch (e) {
        logError(`Error addInstitucionData/${e}`);
        res.status(500).json({ message: "Error, agregando institucion." });
    } finally {
        release();
    }
}


const editInstitucionData = async (req, res) => {
    let data = req.body
    if (sanitizer.containsXSS(data)) {
        return res.status(400).json({ message: "Error en sintáxis" });
    }    
    if (!validator.validateJson(data, schemas.institucionesSchema)) {
        return res.status(400).json({ message: "Error en sintaxis" });
    }

    try {
        await institucionesRepository.actualizarInst(data);
        logInfo(`editInstitucionData`);
        res.status(201).json({ message: "Institucion aeditada correctamente" });
    } catch (e) {
        logError(`Error editInstitucionData/${e}`);
        res.status(500).json({ message: "Error, editando institucion." });
    } finally {
        release();
    }
}


const delInstitucionData = async (req, res) => {
    try {
        let id_institucion = req.body.id_institucion;
        console.log("id:" + id_institucion)
        await institucionesRepository.desactivarInst(id_institucion);
        logInfo(`editInstitucionData`);
        res.status(201).json({ message: "Institucion desactivada correctamente" });
    } catch (e) {
        logError(`Error editInstitucionData/${e}`);
        res.status(500).json({ message: "Error desactivando institucion." });
    } finally {
        release();
    }
}

export default {
    getInstituciones,
    addInstitucionData,
    delInstitucionData,
    editInstitucionData
}
