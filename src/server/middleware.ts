import { Request, Response, NextFunction } from 'express';
import correlator from 'correlation-id';
import { v4 as uuidv4 } from 'uuid';


/**
 * The `key` of *Request Id* for request headers.
 * @constant
 * @type {string}
 */
const HTTP_REQUEST_ID_HEADER: string = 'x-request-id';

/**
 * The `key` of *Correlation Id* for request headers.
 * @constant
 * @type {string}
 */
const HTTP_CORRELATION_ID_HEADER: string = 'x-correlation-id';


/**
 * Set the header *request id* if not found
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers[HTTP_REQUEST_ID_HEADER] ) {
        req.headers[HTTP_REQUEST_ID_HEADER] = uuidv4();
    }
    next();
};


/**
 * Get *request id* handler
 * @param {import('express').Request} req;
 * @returns {string} uuid of the *request*
 */
export const getRequestId = (req: Request) => req.headers[HTTP_REQUEST_ID_HEADER];


/**
 * Get the *correlation id* of the request
 * @returns {function} to get the correlation id
 */
export const getCorrelationId = correlator.getId;

/**
 * Set the headers *correlation id* if not found.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const correlationId = (req: Request, res: Response, next: NextFunction) => {
    let reqCorrelationId = req.headers[HTTP_CORRELATION_ID_HEADER] as string;
    if (!reqCorrelationId) {
      reqCorrelationId = uuidv4();
      req.headers[HTTP_CORRELATION_ID_HEADER] = reqCorrelationId;
    }
    correlator.withId(reqCorrelationId, next);
  };





