import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
import { ProgramRepository } from "../../shared/datos_db_repositories/repositories/program_agua.js";
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




export default {
    getProgramas,
    getProgramasParametros,
    getEstacionesPrograma,
    updateProgramStatus
}
