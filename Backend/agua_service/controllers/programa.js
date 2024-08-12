import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
import { ProgramRepository } from "../../shared/datos_db_repositories/repositories/program_agua.js";
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/programaSchema.js";
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)
const programRepository = new ProgramRepository(connection)

const getProgramas = async (req,res) => {
    try {
        const programas = await aguaRepository.getProgramas({});
        logInfo(`GET getProgramas from database`);
        res.status(200).json(programas);
    } catch (e) {
        logError(`Error getProgramas/${e}`);
        res.status(500).json({ message: "Error, obteniendo los programas." });
    } finally {
        release();
    }
}

const getProgramasParametros = async (req,res) => {
    try {        
        const programasParametros = await aguaRepository.getProgramasParametros({});
        logInfo(`GET getProgramasParametros from database`);
        res.status(200).json(programasParametros);
    } catch (e) {
        logError(`Error getProgramasParametros/${e}`);
        res.status(500).json({ message: "Error, obteniendo los programas parametros." });
    } finally {
        release();
    }
}

const getEstacionesPrograma = async (req,res) => {
    try {
        let idPrograma = req.params.programId;
        const estacionesPrograma = await aguaRepository.getEstacionesPrograma(idPrograma); 
        logInfo(`GET getEstacionesPrograma from database`);
        res.status(200).json(estacionesPrograma);
    } catch (e) {
        logError(`Error getEstacionesPrograma/${e}`);
        res.status(500).json({ message: "Error, obteniendo los programas estaciones." });
    } finally {
        release();
    }
}

const updateProgramStatus = async (req, res) => { 
    try {
        let idProgram = req.body.id_programa;
        const deleteData = await programRepository.inactiveProgram(idProgram);

        logInfo(`UPDATE updateProgramStatus/idProgram/${idProgram}`);
        res.status(201).json({ message: "Programa inactivado correctamente" });
    } catch (e) {

        logError(`Error deleteProgram/${e}/`);    
        res.status(500).json({ message: "Error, inactivando un programa de agua." });
    } finally {

        release();
    }
}


const addProgram = async (req, res) => {
    let data = req.body;
    let parametros = data.parametros;
    let visibleExternos; 
    let estado = 1;   
    try {
    
        if (sanitizer.containsXSS(data)) {
            return res.status(400).json({ message: "Error en sintaxis" });
        }
        
        if (!validator.validateJson(data, schemas.programaSchema)) {
            return res.status(400).json({ message: "Error en sintaxis" });
        }      
        visibleExternos = data.visible ? 1 : 0;

        const { nombre, codigo } = data;

        const codigoExists = await programRepository.countByCodigo(codigo);
        const nombreExists = await programRepository.countByNombre(nombre);

        if (codigoExists || nombreExists ) {
            return res.status(409).json({
                message: "El programa con el mismo código o nombre ya existe",
            });
        }

        const newProgram = await programRepository.addProgram({ data, visibleExternos, estado, parametros});

        logInfo(`POST addProgram/nombre/${nombre}/codigo/${codigo}`);
        res.status(201).json(newProgram);
    } catch (e) {

        logError(`Error addProgram/${e}/`);
        res.status(500).json({ message: "Error al agregar el programa" });
    } finally {
        release();
    }
};


export default {
    getProgramas,
    getProgramasParametros,
    getEstacionesPrograma,
    updateProgramStatus,
    addProgram
}
