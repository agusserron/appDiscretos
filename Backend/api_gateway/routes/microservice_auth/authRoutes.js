const baseIP = "http://172.20.110.33:3000";
const baseRouteAuth = `${baseIP}/api/users`;

const authRoutes = [
    {
        url: '/gateway/auth/login',
        auth: false,
        proxy: {
            target: baseRouteAuth,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/auth`]: '',
            }
        },
    },
    {
        url: '/gateway/auth/user',
        auth: true,
        proxy: {
            target: baseRouteAuth,
            changeOrigin: true,
            logLevel: 'silent',
            pathRewrite: {
                [`^/gateway/auth`]: '',
            }
        },
    }
]

export default authRoutes;