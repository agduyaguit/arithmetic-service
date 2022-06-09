import { Router } from 'express';
import ValidateReq from '@server/utils/validator/request';
import operationHandler from '@controller/operations/operations.handler';

const route = Router();

route.post('/addition', ValidateReq('body', 'AdditionOperation'), operationHandler.addition);
route.post('/subtraction', ValidateReq('body', 'SubtractionOperation'), operationHandler.subtraction);
route.post('/multiplication', operationHandler.multiplication);
route.post('/division', operationHandler.division);

export default route;
