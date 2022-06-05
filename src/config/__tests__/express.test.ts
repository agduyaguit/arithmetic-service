import supertest from 'supertest';
import { createServer } from '@config/express';

describe('Server Test Suite', () => { 
    const app = createServer();

    it('should pass', (done) => {
        supertest(app).get('/healthcheck', expect('Up'));
        done();
    });
 });