import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import healthcheck from 'express-healthcheck';
import { queryParser } from 'express-query-parser';
import expressWinston from 'express-winston';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import {
  correlationId,
  getCorrelationId,
  requestId,
} from './middleware';

import Server from './appServer';

dotenv.config();

/**
 * @class
 */
export default class ServerBuilder {
  _enabledMiddleware: { jsonParser: boolean; urlencodedParser: boolean; queryParser: boolean; helmet: boolean; cors: boolean; error: boolean; requestId: boolean; logger: boolean; correlationId: boolean; };
  _jsonParserOpts: { limit: string; };
  _urlencodedParserOpts: { limit: string; extended: boolean; };
  _queryParserOpts: { parseNull: boolean; parseBoolean: boolean; };
  _helmetOpts: {};
  _corsOpts: { whitelists: string[]; };
  _loggerRouteWhitelist: string[];
  _routes: any[];
  _middlewares: any[];
  _notFoundHandler: (_: any, res: any) => any;
  _enableHealthcheck: boolean;
  _healthcheckOpts: { path: string; testFunc: any; };
  _errorMiddlewares: any[];
  _defaultErrorMiddleware: (err: any, req: any, res: any, next: any) => any;
  _logger: any;
  _swagger: any;
  port: any;
  /**
   * Initializes the `ServerBuilder`.
   */
  constructor() {
    /** @private */
    this._enabledMiddleware = {
      jsonParser: false,
      urlencodedParser: false,
      queryParser: false,
      helmet: false,
      cors: false,
      error: false,
      requestId: false,
      logger: false,
      correlationId: false,
    };

    // * Default options for middlewares.
    /** @private */
    this._jsonParserOpts = { limit: '50mb' };
    /** @private */
    this._urlencodedParserOpts = { limit: '50mb', extended: false };
    /** @private */
    this._queryParserOpts = { parseNull: true, parseBoolean: true };
    /** @private */
    this._helmetOpts = {};
    /** @private */
    this._corsOpts = { whitelists: ['http://localhost:8000'] };
    /**
     * @private
     * List of route that will not be logged by logger
     */
    this._loggerRouteWhitelist = ['/healthcheck'];

    /** @private */
    this._routes = [];
    /** @private */
    this._middlewares = [];

    /**
     * The generic not found route handler.
     * @private
     * @param {express.Request} req
     * @param {express.Response} res
     */
    this._notFoundHandler = (_, res: express.Response) => res.status(404).send({ error: { message: 'Not found' } });

    // * Healthcheck.
    /** @private */
    this._enableHealthcheck = false;
    /** @private */
    this._healthcheckOpts = { path: '/healthcheck', testFunc: null };

    /** @private */
    this._errorMiddlewares = []; // * Error middleware will be added last.

    /**
     * The generic not found route handler.
     * @private
     * @param {express.Errback} err
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    this._defaultErrorMiddleware = (err: express.Errback, req: express.Request, res: express.Response, next: express.NextFunction) =>
      res
        .status(500)
        .json({ error: { message: 'Internal server error', correlationId: getCorrelationId() } });


    /** @private */
    this._logger = null; // * Winston logger instance.

    /** @private */
    this._swagger = {}; // * Swagger config
  }

  /**
   * Enabling the middleware `jsonParser`.
   * @param {Object} [options] The json parser options.
   * @param {string} options.limit E.g: `50mb`.
   */
  enableJsonParser(options: any) {
    this._enabledMiddleware.jsonParser = true;
    if (options) {
      this._jsonParserOpts = options;
    }
    return this;
  }

  /**
   * Enabling the middleware `urlencodedParser`.
   * @param {Object} [options] The json parser options.
   * @param {string} options.limit E.g: `50mb`.
   * @param {boolean} options.extended
   */
  enableUrlencodedParser(options: any) {
    this._enabledMiddleware.urlencodedParser = true;
    if (options) {
      this._urlencodedParserOpts = options;
    }
    return this;
  }

  /**
   * Enabling the middleware `queryParser`.
   * @param {Object} [options] The query parser options.
   * @param {boolean} options.parseNull
   * @param {boolean} options.parseBoolean
   */
  enableQueryParser(options: any) {
    this._enabledMiddleware.queryParser = true;
    if (options) {
      this._queryParserOpts = options;
    }
    return this;
  }

  /**
   * Enabling the middleware `helmet`.
   * @param {Object} [options]
   */
  enableHelmet(options: object) {
    this._enabledMiddleware.helmet = true;
    if (options) {
      this._helmetOpts = options;
    }
    return this;
  }

  /**
   * Enabling the middleware `cors`.
   * @param {Object} [options]
   * @param {string[]} options.whitelists
   */
  enableCors(options: any) {
    this._enabledMiddleware.cors = true;
    if (options) {
      this._corsOpts = options;
    }
    return this;
  }

  /**
   * Enabling the healthcheck app.
   * @param {string} path The path of healthcheck.
   * @param {() => void)} testFunc
   */
  enableHealthcheck(path: string, testFunc: Function) {
    this._enableHealthcheck = true;
    if (path) {
      this._healthcheckOpts.path = path;
    }
    if (testFunc) {
      this._healthcheckOpts.testFunc = testFunc;
    }
    return this;
  }

  /**
   * Enabling the middleware `error` handler.
   */
  enableDefaultErrorMiddleware() {
    this._enabledMiddleware.error = true;
    return this;
  }


  /**
   * Enabling the middleware `logger`.
   * @param {import('winston').Logger} logger
   */
  enableLogger(logger: any) {
    if (!logger) {
      throw new Error('Winston logger instance required');
    }
    this._enabledMiddleware.logger = true;
    this._logger = logger;
    return this;
  }

  /**
   * Enabling the middleware `requestId`.
   */
  enableRequestId() {
    this._enabledMiddleware.requestId = true;
    return this;
  }

  /**
   * Enabling the middleware `correlationId`.
   */
  enableCorrelationId() {
    this._enabledMiddleware.correlationId = true;
    return this;
  }

  /**
   * Set the handler for the route while not found.
   * @param {() => void} handler
   */
  registerNotFoundHandler(handler: () => void) {
    this._notFoundHandler = handler;
    return this;
  }


  /**
   * Register the app routes.
   * @param {string} path
   * @param {express.Router} routes The express router.
   */
  routes(path: string, routes: express.Router) {
    this._routes.push({ path, routes });
    return this;
  }

  /**
   * Regiter the application middleware.
   * @param {express.Handler} middleware
   */
  use(middleware: express.Handler) {
    this._middlewares.push(middleware);
    return this;
  }

  /**
   * Register user-defined error-handling middleware before the default error-handling middleware
   * @param {express.Handler} middleware
   */
  useAfter(middleware: express.Handler) {
    this._errorMiddlewares.push(middleware);
    return this;
  }

  /**
   * Whitelist app route from being logged by logger
   * @param {string} path
   */
  addLoggerRouteWhitelist(path: string) {
    this._loggerRouteWhitelist.push(path);
    return this;
  }

  /**
   * Initializes the `Server` based on `ServerBuilder` configuration.
   * @returns {import('./appServer')} An instance of `Server`.
   */
  build(): Server {
    const app = express();

    if (this._enabledMiddleware.requestId) {
      app.use(requestId);
    }

    if (this._enabledMiddleware.correlationId) {
      app.use(correlationId);
    }

    if (this._enabledMiddleware.jsonParser) {
      app.use(bodyParser.json(this._jsonParserOpts));
    }

    if (this._enabledMiddleware.urlencodedParser) {
      app.use(bodyParser.urlencoded(this._urlencodedParserOpts));
    }

    if (this._enabledMiddleware.queryParser) {
      app.use(queryParser(this._queryParserOpts));
    }

    if (this._enabledMiddleware.helmet) {
      app.use(helmet(this._helmetOpts));
    }

    if (this._enabledMiddleware.cors) {
      app.use(
        cors((req, callback) => {
          let corsOptions;
          if (!req.header('Origin')) {
            corsOptions = { origin: true };
          } else if (this._corsOpts.whitelists.indexOf(req.header('Origin')) !== -1) {
            // reflect (enable) the requested origin in the CORS response
            corsOptions = { origin: true };
          } else {
            // disable CORS for this request
            corsOptions = { origin: false };
          }
          callback(null, corsOptions);
        })
      );
    }


    if (this._enabledMiddleware.logger) {
      app.use(
        expressWinston.logger({
          winstonInstance: this._logger,
          ignoreRoute: (req, res) =>
            // Skip logging if return true
            this._loggerRouteWhitelist.indexOf(req.path) >= 0,
        })
      );
    }

    // Register user defined middleware
    this._middlewares.forEach((middleware) => app.use(middleware));


    // Register swagger doc json
    app.get('/api-docs', (_, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerJSDoc(this._swagger.options));
    });

    // Register routes
    this._routes.forEach(({ path, routes }) => app.use(path, routes));

    // Register healthcheck handler
    if (this._enableHealthcheck) {
      if (this._healthcheckOpts.testFunc) {
        app.use(
          this._healthcheckOpts.path,
          healthcheck({
            test: this._healthcheckOpts.testFunc,
          })
        );
      } else {
        app.use(this._healthcheckOpts.path, healthcheck());
      }
    }

    // Register not found handler
    app.use(this._notFoundHandler);

    this._errorMiddlewares.forEach((errorMiddleware) => app.use(errorMiddleware));

    if (this._enabledMiddleware.error) {
      app.use(this._defaultErrorMiddleware);
    }

    return new Server(app);
  }
}
