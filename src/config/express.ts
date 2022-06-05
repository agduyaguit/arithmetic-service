import operationsRouter from '@controller/operations/operations.routes';
import errorHandler from '@middleware/errorHandler';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@config/swagger.json';

const createServer = (): express.Application => {
    const app = express();

    app.use(express.urlencoded({ extended: true}));
    app.use(cors());
    app.use(express.json());

    app.disable('x-powered-by');

    app.get('/healthcheck', (_req, res) => {
        res.send('Up');
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true}));
    app.use('/operator', operationsRouter);

    app.use(errorHandler);

    return app;
};

export { createServer };