import { Router } from 'express';
import operationHandler from '@controller/operations/operations.handler';

const route = Router();

route.post('/addition', operationHandler.addition);
route.post('/subtraction', operationHandler.subtraction);
route.post('/multiplication', operationHandler.multiplication);
route.post('/division', operationHandler.division);

export default route;
