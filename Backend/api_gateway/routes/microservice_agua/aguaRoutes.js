const baseIP = "http://172.20.110.33:3002";
const baseRouteEstaciones = `${baseIP}/api/agua/estaciones`; 
const baseRouteParametros = `${baseIP}/api/agua/parametros`; 
const baseRouteProgramas = `${baseIP}/api/agua/programas`; 
const baseRouteRangos = `${baseIP}/api/agua/rangos`;
const baseRouteAgua = `${baseIP}/api/agua`;

const aguaRoutes = [
    {
        url: '/gateway/microservice_agua/estaciones',
        proxy: {
            target: baseRouteEstaciones,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_agua/estaciones`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_agua/parametros',
        proxy: {
            target: baseRouteParametros,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_agua/parametros`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_agua/programas',
        proxy: {
            target: baseRouteProgramas,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_agua/programas`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_agua/rangos',
        proxy: {
            target: baseRouteRangos,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_agua/rangos`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_agua',
        proxy: {
            target: baseRouteAgua,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_agua`]: '',
            }
        },
    },
]

export default aguaRoutes;

