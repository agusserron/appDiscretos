import cors from 'cors'

const allowedOrigins = ['http://localhost:4200', 'http://localhost:3005', 'http://172.20.110.33'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Acceso no permitido'));
    }
  },
  optionsSuccessStatus: 200 
}

const middlewareCors = (req, res, next) => {
  cors(corsOptions)(req, res, err => {
    if (err) {
      if (err.message === 'Acceso no permitido') {
        res.status(403).send('Acceso no permitido');
      } else {
        res.status(500).send('Error interno del servidor');
      }
    } else {
      next();
    }
  });
};

export default {
    middlewareCors
}
