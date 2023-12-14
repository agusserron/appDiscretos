import { AguaRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const aguaRepository = new AguaRepository(connection)

const addAguaData = async (req, res) => {
    let body = req.body
    if (sanitizer.containsXSS(body)) return res.status(400).json({ message: "Error en sintáxis" });
    try {
        const lengthValores = body[0].Valores.length;
        const valores = body[0].Valores;
        for (let index = 0; index < lengthValores; index++) {
            const data = valores[index];
            await aguaRepository.add({ data });
        }
        logInfo(`POST addAguaData`);
        res.status(201).json({ message: "Datos de agua agregados correctamente" });
    } catch (e) {
        logError(`Error addAguaData/${e}`);
        res.status(500).json({ message: "Error, agregando datos calidad agua." });
    } finally {
        release();
    }
}

const getAguaReports = async (req, res) => {
    try {
        const reports = await aguaRepository.get({});
        logInfo(`GET getAguaReports from database`);
        res.status(200).json(reports);
    } catch (e) {
        logError(`Error getAguaReports/${e}`);
        res.status(500).json({ message: "Error, obteniendo datos de los reportes de agua." });
    } finally {
        release();
    }
}

const getMatrices = async (req,res) => {
    try {
        const matriz = await aguaRepository.getMatrices({});
        logInfo(`GET getMatrices from database`);
        res.status(200).json(matriz);
    } catch (e) {
        logError(`Error getMatrices/${e}`);
        res.status(500).json({ message: "Error, obteniendo las matrices." });
    } finally {
        release();
    }
}

const getUnidades = async (req,res) => {
    try {
        const unidades = await aguaRepository.getUnidades({});
        logInfo(`GET getUnidades from database`);
        res.status(200).json(unidades);
    } catch (e) {
        logError(`Error getUnidades/${e}`);
        res.status(500).json({ message: "Error, obteniendo las unidades." });
    } finally {
        release();
    }
}

const getInstituciones = async (req,res) => {
    try {
        const instituciones = await aguaRepository.getInstituciones({});
        logInfo(`GET getInstituciones from database`);
        res.status(200).json(instituciones);
    } catch (e) {
        logError(`Error getInstituciones/${e}`);
        res.status(500).json({ message: "Error, obteniendo las instituciones." });
    } finally {
        release();
    }
}

const getDepartamentos = async (req,res) => {
    try {
        const departamentos = await aguaRepository.getDepartamentos({});
        logInfo(`GET getDepartamentos from database`);
        res.status(200).json(departamentos);
    } catch (e) {
        logError(`Error getDepartamentos/${e}`);
        res.status(500).json({ message: "Error, obteniendo los departamentos." });
    } finally {
        release();
    }
}

const getMuestras = async (req,res) => {
    try {
        const muestras = await aguaRepository.getMuestras({});
        logInfo(`GET getMuestras from database`);
        res.status(200).json(muestras);
    } catch (e) {
        logError(`Error getMuestras/${e}`);
        res.status(500).json({ message: "Error, obteniendo las muestras." });
    } finally {
        release();
    }
}

const getEnumerados = async (req,res) => {
    try {
        const enumerados = await aguaRepository.getEnumerados({});
        logInfo(`GET getEnumerados from database`);
        res.status(200).json(enumerados);
    } catch (e) {
        logError(`Error getEnumerados/${e}`);
        res.status(500).json({ message: "Error, obteniendo los enumerados." });
    } finally {
        release();
    }
}

export default {
    addAguaData,
    getAguaReports,
    getMatrices,
    getUnidades,
    getInstituciones,
    getDepartamentos,
    getMuestras,
    getEnumerados,
}