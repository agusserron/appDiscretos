const baseIP = "http://172.20.110.33:3001";
const baseRouteStation = `${baseIP}/api/aire/station`;
const baseRoutePlant = `${baseIP}/api/aire/plants`;
const baseRouteCompany = `${baseIP}/api/aire/companys`;
const baseRouteAire = `${baseIP}/api/aire`;

const aireRoutes = [
    {
        url: '/gateway/microservice_aire/station',
        proxy: {
            target: baseRouteStation,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_aire/station`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_aire/plant',
        proxy: {
            target: baseRoutePlant,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_aire/plant`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_aire/company',
        proxy: {
            target: baseRouteCompany,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_aire/company`]: '',
            }
        },
    },
    {
        url: '/gateway/microservice_aire/aire',
        proxy: {
            target: baseRouteAire,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/microservice_aire/aire`]: '',
            }
        },
    }
]

export default aireRoutes;