import { createProxyMiddleware } from 'http-proxy-middleware';
import auth from '../../shared/authorization_middleware/auth.js';

const setupProxies = async (app, routes) => {
    routes.forEach(r => {
        app.use(r.url, async (req, res, next) => {
            await auth.verifyToken(req, res,next); 
        }, createProxyMiddleware(r.proxy));
    });
}

export default setupProxies;