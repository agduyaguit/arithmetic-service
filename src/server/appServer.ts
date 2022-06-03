import {Express} from 'express';

class Server {
    _app: Express;
    _server: any;
    /**
     * Initializes the `Server`.
     * @param {import('express').Express} app The `express` application.
     */
    constructor(app: Express) { 
      /** @private */
      this._app = app;
      /** @private */
      this._server = null;
    }
  
    /**
     * Start the service.
     * @param {number} port Target port to start.
     * @param {() => void} [cb] The callback function that would be called after start.
     * @throws Will throw an error if the port is null or undefined.
     * @returns {boolean}
     */
    start(port: number, cb: () => void) {
      const startCb = cb || (() => console.log(`Server is running on port: ${port}`));
      if (!port) {
        throw new Error('Empty argument: port');
      }
      if (this._server) {
        return false;
      }
      this._server = this._app.listen(port, startCb);
  
      process.on('SIGTERM', () => this.stop());
      process.on('SIGINT', () => this.stop());
  
      return true;
    }
  
    /**
     * Stop the service.
     * @returns {boolean}
     */
    stop() {
      if (!this._server) {
        return false;
      }
      console.log('Server is stopping');
      this._server.close();
      this._server = null;
      return true;
    }
  };
  
  export default Server;