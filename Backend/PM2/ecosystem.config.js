module.exports = {
    apps: [
        {
            name: "api_gateway",
            script: "../api_gateway/server.js",
            error_file: "../api_gateway/error.log",
            out_file: "../api_gateway/output.log",
            instances: 3,
        },
        {
            name: "adapter_service",
            script: "../adapter_service/index.js",
            error_file: "../adapter_service/error.log",
            out_file: "../adapter_service/output.log",
        },
        {
            name: "aire_service",
            script: "../aire_service/index.js",
            error_file: "../aire_service/error.log",
            out_file: "../aire_service/output.log",
            env: {
                "DATOS_DB_HOST": "127.0.0.1", "DATOS_DB_PORT": 5000, "DATOS_DB_DATABASE": "datosdb", "DATOS_DB_USER": "usr_data", "DATOS_DB_PASSWORD": "Srddat0s2023.",
                "JWT_PUBLIC_KEY_PATH": "../auth_service/jwtRS256.key.pub"
            }
        },
        {
            name: "agua_service",
            script: "../agua_service/index.js",
            error_file: "../agua_service/error.log",
            out_file: "../agua_service/output.log",
            env: {
                "DATOS_DB_HOST": "127.0.0.1", "DATOS_DB_PORT": 5000, "DATOS_DB_DATABASE": "datosdb", "DATOS_DB_USER": "usr_data", "DATOS_DB_PASSWORD": "Srddat0s2023.",
                "JWT_PUBLIC_KEY_PATH": "../auth_service/jwtRS256.key.pub"
            }
        },
        {
            name: "auth_service",
            script: "../auth_service/app.js",
            error_file: "../auth_service/error.log",
            out_file: "../auth_service/output.log",
            env: {
                "DATOS_DB_HOST": "127.0.0.1", "DATOS_DB_PORT": 5000, "DATOS_DB_DATABASE": "authdb", "DATOS_DB_USER": "usr_auth", "DATOS_DB_PASSWORD": "Srd4uth2023.",
                "JWT_PUBLIC_KEY_PATH": "../auth_service/jwtRS256.key.pub",
                "JWT_PRIVATE_KEY_PATH": "../auth_service/jwtRS256.key"
            }
        },
        {
            name: "cron_jobs",
            script: "../cron_jobs/index.js",
            error_file: "../cron_jobs/error.log",
            out_file: "../cron_jobs/output.log",
            env: { "DATOS_DB_HOST": "127.0.0.1", "DATOS_DB_PORT": 5000, "DATOS_DB_DATABASE": "datosdb", "DATOS_DB_USER": "usr_data", "DATOS_DB_PASSWORD": "Srddat0s2023." }
        }
    ],
};