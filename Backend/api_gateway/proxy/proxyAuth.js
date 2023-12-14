import { createProxyMiddleware } from 'http-proxy-middleware';
import auth from '../../shared/authorization_middleware/auth.js';

const setupProxyAuth = async (app, routes) => {
    routes.forEach(r => {
        if(r.auth){
            app.use(r.url, auth.verifyToken)
        }
        app.use(r.url,createProxyMiddleware(r.proxy));
    });
}

export default setupProxyAuth;