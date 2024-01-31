const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");


const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    transports: [
        new transports.DailyRotateFile({
            name: `info-log-file`,
            filename: `Logs/info-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            maxFiles: '30d'
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
            ),
        }),
    ],
});


exports.logInfo = (arg) => (typeof (arg) === "object"
    ? logger.info(JSON.stringify(arg))
    : logger.info(arg));
exports.logError = logger.error;