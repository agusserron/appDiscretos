import { StationAireRepository } from "../../shared/datos_db_repositories/index.js";
import env from "dotenv"
import { logInfo, logError } from "../../shared/logger/logger.js"
import sanitizer from "../../shared/sanitizer_middleware/sanitizer.js";
import validator from "../../shared/validatorJSON/validateJson.js";
import schemas from "../../shared/validatorJSON/schemas/stationSchema.js";
import handler from '../handlers/stationHandler.js';
import { getConnection } from '../../shared/connectionMariaDB/connection.js';
env.config();

const { connection, release } = await getConnection();
const stationAireRepository = new StationAireRepository(connection)

const addStationAire = async (req, res) => {
    try {
        let data = req.body;
        if (!validator.validateJson(data, schemas.stationSchema)) return res.status(400).json({ message: "Error en sintáxis" });
        if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });
        const quantity = await stationAireRepository.existStation(data.codigo);
        if (quantity == 0) {
            await stationAireRepository.add({ data });
            await addPeriodStation({ data });
            await addParameterStation({ data });
            logInfo(`POST addStationAire/codigo/${data.codigo}/username: ${req.user.username}`);
            res.status(201).json({ message: "Estación aire agregada correctamente" });
        }
        else {
            logError(`POST alreadyExist addStationAire/codigo/${data.codigo}/username: ${req.user.username}`);
            res.status(409).json({ message: "Ya existe la estación" });
        }
    } catch (e) {
        logError(`Error addAireData/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, agregando una nueva estación de aire." });
    }
    finally {
        release();
    }
}

const updateStationAire = async (req, res) => {
    try {
        let data = req.body;
        if (!validator.validateJson(data, schemas.stationSchema)) return res.status(400).json({ message: "Error en sintáxis" });
        if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });
        const codigo = data.codigo;
        const station = await stationAireRepository.getStation(codigo);
        if (!station) {
            logError(`PUT NotExist updateStationAire/codigo/${codigo}/username: ${req.user.username}`);
            return res.status(409).json({ message: "No existe la estación" });
        }
        await stationAireRepository.update({ data, codigo });
        await handleUpdateParameterStation(res, data);
        await handleUpdatePeriodStation(req, res, data);
    }
    catch (e) {
        logError(`Error updateStationAire/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, editando una estación de aire." });
    }
    finally {
        release();
    }
}

const handleUpdateParameterStation = async (res, data) => {
    try {
        await updateParameterStation({ data });
    } catch (parameterError) {
        throw handler.handleParameterError(res, parameterError);
    }
};

const handleUpdatePeriodStation = async (req, res, data) => {
    try {
        await updatePeriodStation({ data });
        logInfo(`PUT updateStationAire/codigo/${data.codigo}/username: ${req.user.username}`);
        return res.status(201).json({ message: "Estación de aire modificada correctamente" });
    } catch (periodError) {
        throw handler.handlePeriodError(res, periodError)
    }
};

const deleteStationAire = async (req, res) => {
    try {
        let codigo = req.query.codigo;
        if (sanitizer.containsXSS(codigo)) return res.status(400).json({ message: "Error en sintáxis" });
        const station = await stationAireRepository.getStation(codigo);
        if (!station) {
            logInfo(`DELETE NotExist deleteStationAire/codigo/${codigo}/username: ${req.user.username}`);
            res.status(409).json({ message: "No existe la estación" });
        }
        else {
            const existStationReport = await stationAireRepository.existStationReport(station.id);
            if (!existStationReport) {
                await stationAireRepository.deleteAllPeriods(station.id);
                await stationAireRepository.deleteAllParameters(station.id);
                await stationAireRepository.delete(station.id);
                logInfo(`DELETE deleteStationAire/codigo/${codigo}/username: ${req.user.username}`);
                res.status(201).json({ message: "Estación de aire eliminada correctamente" });
            }
            else {
                logError(`DELETE ExistReportStation deleteStationAire/codigo/${codigo}/username: ${req.user.username}`);
                res.status(400).json({ message: "No es posible eliminar la estación, cuenta con reportes asociados" });
            }
        }
    } catch (e) {
        logError(`Error deleteStationAire/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, eliminado una estación de aire." });
    }
    finally {
        release();
    }
}

const getStations = async (req, res) => {
    try {
        const stations = await stationAireRepository.get({});
        logInfo(`GET getStations from database/username: ${req.user.username}`);
        res.status(200).json(stations);
    } catch (e) {
        logError(`Error getStations/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo datos de las estaciones." });
    }
    finally {
        release();
    }
}

const getInstitutes = async (req, res) => {
    try {
        const institutes = await stationAireRepository.getInstitutes({});
        logInfo(`GET getInstitutes from database/username: ${req.user.username}`);
        res.status(200).json(institutes);
    } catch (e) {
        logError(`Error getInstitutes/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo las instituciones." });
    }
    finally {
        release();
    }
}

const getParameters = async (req, res) => {
    try {
        const parameters = await stationAireRepository.getParameters({});
        logInfo(`GET getParameters from database/username: ${req.user.username}`);
        res.status(200).json(parameters);
    } catch (e) {
        logError(`Error getParameters/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo los parametros de las estaciones." });
    }
    finally {
        release();
    }
}

const getPeriods = async (req, res) => {
    try {
        const periods = await stationAireRepository.getPeriods({});
        logInfo(`GET getPeriods from database/username: ${req.user.username}`);
        res.status(200).json(periods);
    } catch (e) {
        logError(`Error getPeriods/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo los periodos de muestra." });
    }
    finally {
        release();
    }
}

// agus
const deleteDataStation = async (req, res) => { 
    try {
        let idData = req.body.idData;
        const deleteData = await stationAireRepository.deleteDataStation(idData, req.user.username);

        logInfo(`UPDATE deleteDataStation/idData/${idData}/username: ${req.user.username}`);
        res.status(201).json({ message: "Dato eliminado correctamente" });
    } catch (e) {

        logError(`Error deleteDataStation/${e}/username: ${req.user.username}`);    
        res.status(500).json({ message: "Error, eliminando un dato de una estación de aire." });
    } finally {

        release();
    }
}


const getParametersByStation = async (req, res) => {

    try {
        let idReporte = req.params.idReporte;
        const station = await stationAireRepository.getStationByIdReport(idReporte);
        const parameters = await stationAireRepository. getParametersIdStation(station.idEstacion);
        const totalParameters = await stationAireRepository.getParameters({});
        let parametros = [];

        parameters.forEach(parametroEstacion => {
            totalParameters.forEach(parametroTotal => {
                if (parametroEstacion.idParametro === parametroTotal.id_parametro) {
                    parametros.push(parametroTotal.nombre_clave);
                }
            });
        });
        logInfo(`GET getParametersByStation/idReporte/${idReporte}/username: ${req.user.username}`);
        res.status(200).json({ parametros });
    } catch (e) {
        logError(`Error getParametersByStation/${e}/username: ${req.user.username}`);

        res.status(500).json({ message: "Error, obteniendo parametros de una estación." });
    } finally {
        release();
    }
}

const getPeriodsByStation = async (req, res) => {
    try {
        let idReporte = req.params.idReporte;
        const station = await stationAireRepository.getStationByIdReport(idReporte);
        const periods = await stationAireRepository.getPeriodsIdStation(station.idEstacion);
        const totalPeriods = await stationAireRepository.getPeriodos({});
        let periodos = [];

        periods.forEach(periodoEstacion => {
            totalPeriods.forEach(periodoTotal => {
                if (periodoEstacion.idPeriodo === periodoTotal.id) {
                    periodos.push(periodoTotal.tipo);
                }
            }
            );
        });

        console.log(periodos);
        logInfo(`GET getPeriodsByStation/idReporte/${idReporte}/username: ${req.user.username}`);
        res.status(200).json({ periodos });
    } catch (e) {
        logError(`Error getPeriodsByStation/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo periodos de una estación." });
    } finally {
        release();
    }
}





// update data report 
const updateDataReport =  async (req, res) => {
    try {
        const newData = req.body;
        let parametroNuevo= 0;
       
        const periods = await stationAireRepository.getPeriods({});
        const parameters = await stationAireRepository.getParameters({});

        const reporte = await stationAireRepository.getStationByIdReport(newData.idReporte);

        const idStation = reporte.idEstacion;
        const parametrosEstacion = await stationAireRepository.getParametersIdStation(idStation);

        for (const parameter of parameters) {
            if (parameter.nombre_clave === newData.parametro) {
                newData.idParametro = parameter.id_parametro;
            }
        }
        for (const period of periods) { 
            if (period.nombre === newData.tipoPeriodo) {
                newData.tipoPeriodo = period.id;
            }
        }
        let idParametro = newData.idParametro;	

        
       for (const parametro of parametrosEstacion) {
            if (parametro.idParametro == idParametro) {
                parametroNuevo = parametro.id;
            }   
        }
        
        await stationAireRepository.updateDataReport(newData, parametroNuevo);
        logInfo(`UPDATE updateDataReport/idData/${newData.idReporte}/username: ${req.user.username}`);
        res.status(201).json({ message: "Dato editado correctamente" });

    } catch (e) {
        logError(`Error updateDataReport/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, editando un dato de una estación de aire." });
    } finally {
        release();
    }
  }


  /////////////////

const addStationReport = async (req, res) => {
    try {
        let data = req.body;
        if (!validator.validateJson(data, schemas.stationReportSchema)) return res.status(400).json({ message: "Error en sintáxis" });
        if (sanitizer.containsXSS(data)) return res.status(400).json({ message: "Error en sintáxis" });

        const station = await stationAireRepository.getStation(data.station.codigo);
        if (!station) return res.status(404).json({ message: "La estación no existe" });
        let periodo = await stationAireRepository.getStationPeriodo(station.id, data.tipoPeriodo);
        if (!periodo) return res.status(404).json({ message: "El periodo no existe" });
        let parameter = await stationAireRepository.getStationParameter(station.id, data.parametro);
        if (!parameter) return res.status(404).json({ message: "El parametro no existe" });

        const dateReport = data.fecha.split('T');
        data.fecha = dateReport[0];

        const existReport = await stationAireRepository.getStationReportByData(data.fecha, periodo.id, station.id, parameter.id, data.concentracion);
        if (existReport) {
            return res.status(400).json({ message: "El reporte ya existe" });
        }

        await stationAireRepository.addStationReport(data, periodo.id, station.id, parameter.id);
        logInfo(`POST addStationReport/codigo/${data.station.codigo}/username: ${req.user.username}`);
        res.status(201).json({ message: "Reporte de estación agregado correctamente" });
    } catch (e) {
        logError(`Error addAireData/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, agregando una nueva estación de aire." });
    }
    finally {
        release();
    }
}




const getStationReports = async (req, res) => {
    try {
        let codigo = req.query.codigo;
        if (sanitizer.containsXSS(codigo)) return res.status(400).json({ message: "Error en sintáxis" });
        const station = await stationAireRepository.getStation(codigo);
        if (!station) return res.status(404).json({ message: "La estación no existe" });
        const reportStation = await stationAireRepository.getStationReport(station.id);
        reportStation.forEach(report => {
            report.fecha = report.fecha.toLocaleDateString('en-GB');
        })
        logInfo(`GET getReportsStation/codigo/${codigo}/username: ${req.user.username}`);
        res.status(200).json({ report: reportStation });
    } catch (e) {
        logError(`Error getReportsStation/${e}/username: ${req.user.username}`);
        res.status(500).json({ message: "Error, obteniendo reportes de una estación." });
    }
    finally {
        release();
    }
}

const addPeriodStation = async ({ data }) => {
    try {
        const station = await stationAireRepository.getStation(data.codigo);
        const periods = data.periodos;
        for (const idPeriod of periods) {
            await stationAireRepository.addStationPeriodo(station.id, idPeriod);
        }
        logInfo(`POST addPeriodoStation/codigo/${data.codigo}`);
    } catch (e) {
        logError(`Error addPeriodoStation/${e}`);
        res.status(500).json({ message: "Error, agregando periodos en estación de aire." });
    }
    finally {
        release();
    }
}

const addParameterStation = async ({ data }) => {
    try {
        const station = await stationAireRepository.getStation(data.codigo);
        const parameters = data.parametros;
        for (const idParameter of parameters) {
            await stationAireRepository.addStationParameter(station.id, idParameter);
        }
        logInfo(`POST addParameterStation/codigo/${data.codigo}`);
    } catch (e) {
        logError(`Error addParameterStation/${e}`);
        res.status(500).json({ message: "Error, agregando parametros en estación de aire." });
    }
    finally {
        release();
    }
}

const updatePeriodStation = async ({ data }) => {
    try {
        const station = await stationAireRepository.getStation(data.codigo);
        const stationPeriods = await stationAireRepository.getPeriodsByStation(station.id);
        const newPeriods = data.periodos;
        //ME FIJO SI HAY PERIODOS QUE SE DECIDEN SACAR Y VERIFICO QUE SE PUEDAN QUITAR(SI NO TIENE REPORTES ASOCIADOS)
        const elementsMissingStation = stationPeriods.filter((element) => !newPeriods.includes(element));
        for (const period of elementsMissingStation) {
            const periodStation = await stationAireRepository.getStationPeriodo(station.id, period);
            const existReportPeriod = await stationAireRepository.existStationPeriod(station.id, periodStation.id)
            if (existReportPeriod) {
                throw new Error("Error, no se pueden quitar períodos con reportes asociados.");
            } else {
                await stationAireRepository.deletePeriodById(periodStation.id)
            }
        };
        //ME FIJO SI HAY NUEVOS PERIODOS Y LOS AGREGO
        const newPeriodsToAdd = newPeriods.filter((elemento) => !stationPeriods.includes(elemento));
        newPeriodsToAdd.forEach(async (period) => {
            await stationAireRepository.addStationPeriodo(station.id, period);
        });
        logInfo(`PUT updatePeriodStation/codigo/${data.codigo}`);

    } catch (e) {
        logError(`Error updatePeriodStation/${e}`);
        throw e;
    }
    finally {
        release();
    }
}

const updateParameterStation = async ({ data }) => {
    try {
        const station = await stationAireRepository.getStation(data.codigo);
        const stationParameters = await stationAireRepository.getParametersByStation(station.id);
        const newParameters = data.parametros;
        //ME FIJO SI HAY PARAMETROS QUE SE DECIDEN SACAR Y VERIFICO QUE SE PUEDAN QUITAR(SI NO TIENE REPORTES ASOCIADOS)
        const parametersMissingStation = stationParameters.filter((element) => !newParameters.includes(element));
        for (const parameter of parametersMissingStation) {
            const parameterStation = await stationAireRepository.getStationParameter(station.id, parameter);
            const existReportParameter = await stationAireRepository.existStationParameter(station.id, parameterStation.id)
            if (existReportParameter) {
                throw new Error("Error, no se pueden quitar parametros con reportes asociados.");
            } else {
                await stationAireRepository.deleteParameterById(parameterStation.id)
            }
        };
        //ME FIJO SI HAY NUEVOS PARAMETROS Y LOS AGREGO
        const newParameterToAdd = newParameters.filter((elemento) => !stationParameters.includes(elemento));
        newParameterToAdd.forEach(async (param) => {
            await stationAireRepository.addStationParameter(station.id, param);
        });
        logInfo(`PUT updateParameterStation/codigo/${data.codigo}`);

    } catch (e) {
        logError(`Error updateParameterStation/${e}`);
        throw e;
    }
    finally {
        release();
    }
}

export default {
    addStationAire,
    updateStationAire,
    getStations,
    deleteStationAire,
    addStationReport,
    getStationReports,
    getInstitutes,
    getPeriods,
    getParameters, 
    deleteDataStation,
    updateDataReport,
    getParametersByStation,
    getPeriodsByStation 

}