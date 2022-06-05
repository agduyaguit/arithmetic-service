// import locationRouter from '@server/controller/operations/operations.routes';
import errorHandler from '@middleware/errorHandler';
import express from 'express';
import cors from 'cors';

const createServer = (): express.Application => {
    const app = express();

    app.use(express.urlencoded({ extended: true}));
    app.use(cors());
    app.use(express.json());

    app.disable('x-powered-by');

    app.get('/healthcheck', (_req, res) => {
        res.send('Up');
    });

  //  app.use('/', locationRouter);

    app.use(errorHandler);

    return app;
};

export { createServer };