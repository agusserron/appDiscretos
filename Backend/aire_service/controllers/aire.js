import { AireRepository, PlantRepository } from "../../shared/datos_db_repositories/index.js"
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/aireSchema.js";
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();

const aireRepository = new AireRepository(connection)
const plantRepository = new PlantRepository(connection)

const addAireData = async (req, res) => {
  let data = req.body
  try {
    if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });
    if (!validator.validateJson(data, schemas.aireSchema)) return res.status(400).json({ message: "Error en sintáxis" });
    const cumpleDecreto = await validateState(data);
    if (cumpleDecreto) data.estado = 1;
    const dateStart = data.fechaInicio.split('T');
    const dateFin = data.fechaFin.split('T');
    data.fechaInicio = dateStart[0];
    data.fechaFin = dateFin[0];
    const quantity = await aireRepository.existReport(data);
    if (quantity == 0) {
      await aireRepository.add({ data });
      logInfo(`POST addAireData/idPlant/${data.idPlant}/username: ${req.user.username}`);
      res.status(201).json({ message: "Datos de aire agregados correctamente" });
    }
    else {
      logInfo(`POST alreadyExist addAireData/idPlant/${data.idPlant}/username: ${req.user.username}`);
      res.status(409).json({ message: "Atención! El reporte ya fue realizado anteriormente" });
    }
  } catch (e) {
    logError(`Error addAireData/${e}/username: ${req.user.username}`);
    res.status(500).json({ message: "Error, agregando datos calidad aire." });
  }
  finally {
    release();
  }
}

const getAireReport = async (req, res) => {
  let nroEnlace = req.query.nroEnlace;
  try {
    if (sanitizer.containsXSS(nroEnlace)) return res.status(400).json({ message: "Error en sintáxis" });
    let plant = await plantRepository.get(nroEnlace);
    if (!plant) return res.status(404).json({ message: "El número de enlace no tiene planta asociada" });
    let idPlant = plant.id;
    let aireReport = await aireRepository.getReport(idPlant);
    aireReport.forEach(report => {
      report.fechaInicio = report.fechaInicio.toLocaleDateString('en-GB');
      report.fechaFin = report.fechaFin.toLocaleDateString('en-GB');
    })
    logInfo(`GET getAireReport report/idPlant/${idPlant} from database  /username: ${req.user.username}`);
    res.status(200).json({ aireReport });
  } catch (e) {
    logError(`Error getAireReport report/idPlant/${idPlant}/${e}/username: ${req.user.username}`);
    res.status(500).json({ message: "Error, obteniendo el reporte de aire de una planta." });
  }
  finally {
    release();
  }
}

const getAireReportByCity = async (req, res) => {
  let city = req.query.city;
  try {
    if (sanitizer.containsXSS(city)) return res.status(400).json({ message: "Error en sintáxis" });
    let aireReport = await aireRepository.getReportByCity(city);
    aireReport.forEach(report => {
      report.fechaInicio = report.fechaInicio.toLocaleDateString('en-GB');
      report.fechaFin = report.fechaFin.toLocaleDateString('en-GB');
    })
    logInfo(`GET getAireReportByCity report/city/${city} from database  /username: ${req.user.username}`);
    res.status(200).json({ aireReport });
  } catch (e) {
    logError(`Error getAireReportByCity report/city/${city}/${e}/username: ${req.user.username}`);
    res.status(500).json({ message: "Error, obteniendo reportes de calidad por departamento." });
  }
  finally {
    release();
  }
}

const getParameters = async (req, res) => {
  try {
      const parameters = await aireRepository.getParameters({});
      logInfo(`GET getParameters from database/username: ${req.user.username}`);
      res.status(200).json(parameters);
  } catch (e) {
      logError(`Error getParameters/${e}/username: ${req.user.username}`);
      res.status(500).json({ message: "Error, obteniendo los parametros de aire." });
  }
  finally {
      release();
  }
}

const getUnits = async (req, res) => {
  try {
      const units = await aireRepository.getUnits({});
      logInfo(`GET getUnits from database/username: ${req.user.username}`);
      res.status(200).json(units);
  } catch (e) {
      logError(`Error getUnits/${e}/username: ${req.user.username}`);
      res.status(500).json({ message: "Error, obteniendo las unidades de aire." });
  }
  finally {
      release();
  }
}

//FALTA VALIDAR O3 Y VER QUE ES MAXIMA DIARIA
const validateState = async (data) => {
  if (data.parametro == "CO") {
    if (data.frecuencia == '1h' && data.valor > 30000) return false;
  }
  else if (data.parametro == "NO₂") {
    if (data.frecuencia == '1h' && data.valor > 200) return false;
  }
  else if (data.parametro == "O₃") {
    if (data.frecuencia == '1h' && data.valor > 200) return false;
  }
  else if (data.parametro == "SO₂") {
    if (data.frecuencia == '1h' && data.valor > 300) return false;
    else if (data.frecuencia == '24hs' && data.valor > 50) return false;
  }
  else if (data.parametro == "PM2.5") {
    if (data.frecuencia == '24hs' && data.valor > 35) return false;
    else if (data.frecuencia == '1 año' && data.valor > 25) return false;
  }
  else if (data.parametro == "PM10") {
    if (data.frecuencia == '24hs' && data.valor > 75) return false;
    else if (data.frecuencia == '1 año' && data.valor > 30) return false;
  }
  else if (data.parametro == "Pb") {
    if (data.frecuencia == '1 año' && data.valor > 0.5) return false;
  }
  else if (data.parametro == "TRS") {
    if (data.frecuencia == '30m' && data.valor > 10) return false;
    else if (data.frecuencia == '24hs' && data.valor > 7) return false;
  }
  return true
}


export default {
  addAireData,
  getAireReport,
  getAireReportByCity,
  getParameters,
  getUnits
}