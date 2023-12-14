import { PlantRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/plantSchema.js";
env.config();

const { connection, release } = await getConnection();
const plantRepository = new PlantRepository(connection)

const getPlants = async (req, res) => {
    try {
        const plants = await plantRepository.getAllPlants({});
        logInfo(`GET getPlants from database/username: ${req.user.username}`);
        res.status(200).json(plants);
    } catch (e) {
        logError(`Error getPlants/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo datos de las plantas." });
    }
    finally {
        release();
    }
}

const getAllNrosEnlace = async (req, res) => {
    try {
        const response = await plantRepository.getAllNroEnlaces();
        logInfo(`GET getAllNroEnlaces  /username: ${req.user.username}`);
        res.status(200).json(response);
    } catch (e) {
        logError(`Error getAllNroEnlaces/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo los numeros de enlace." });
    }
    finally {
        release();
    }
}

const addPlant = async (req, res) => {
    let data = req.body;
    try {
        if (!validator.validateJson(data, schemas.plantSchema)) return res.status(400).json({ message: "Error en sintáxis" });
        if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });
        const existPlant = await plantRepository.existNroEnlace(data.nroEnlace);
        if (existPlant == 0) {
            await plantRepository.addPlant({ data });
            logInfo(`POST addPlant/nroEnlace/${data.nroEnlace} to database  /username: ${req.user.username}`);
            res.status(201).json({ message: "Planta agregada correctamente" });
        }
        else {
            logInfo(`POST nroEnlaceAlreadyExist addPlant/nroEnlace/${data.nroEnlace} to database  /username: ${req.user.username}`);
            res.status(409).json({ message: "Número de enlace ya esta asociado a una planta" });
        }
    } catch (e) {
        logError(`Error addCompany/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, agregando una planta." });
    }
    finally {
        release();
    }
}

const getPlant = async (req, res) => {
    let nroEnlace = req.query.nroEnlace;
    try {
        if (sanitizer.containsXSS(nroEnlace)) return res.status(400).json({ message: "Error en sintáxis" });
        const plant = await plantRepository.get(nroEnlace);
        logInfo(`GET getPlant for número enlace: ${nroEnlace} /username: ${req.user.username}`);
        res.status(200).json({ plant });
    } catch (e) {
        logError(`Error getPlant/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo la planta." });
    }
    finally {
        release();
    }
}

const getDepartaments = async (req, res) => {
    try {
        const departaments = await plantRepository.getViewDepartament({});
        logInfo(`GET getDepartaments from database/username: ${req.user.username}`);
        res.status(200).json(departaments);
    } catch (e) {
        logError(`Error getDepartaments/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo los departamentos." });
    }
    finally {
        release();
    }
}

export default {
    getPlants,
    getPlant,
    getAllNrosEnlace,
    addPlant,
    getDepartaments
}