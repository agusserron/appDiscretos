const handlePeriodError = (res, error) => {
    const errorMessage = error.message === "Error, no se pueden quitar períodos con reportes asociados."
        ? error.message
        : "Error, actualizando los períodos de una estación.";
    res.status(400).json({ message: errorMessage });
};

const handleParameterError = (res, error) => {
    const errorMessage = error.message === "Error, no se pueden quitar parametros con reportes asociados."
        ? error.message
        : "Error, actualizando los parametros de una estación.";
    return res.status(400).json({ message: errorMessage });
};

export default {
    handlePeriodError,
    handleParameterError
}