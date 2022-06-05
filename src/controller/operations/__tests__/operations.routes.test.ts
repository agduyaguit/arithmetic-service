import operationsRouter from '@controller/operations/operations.routes';

jest.mock('@utils/validator/request', () => jest.fn().mockImplementation(() => jest.fn()));

describe(`Router Test Suite`, () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should have the /addition path', () => {
        const { route: { path, methods }} = operationsRouter.stack[0];

        expect(path).toBe('/addition');
        expect(methods).toMatchObject({ post: true});
    });

    it('Should have the /substraction path', () => {
        const { route: { path, methods }} = operationsRouter.stack[1];

        expect(path).toBe('/subtraction');
        expect(methods).toMatchObject({ post: true});
    });

    it('Should have the /multiplication path', () => {
        const { route: { path, methods }} = operationsRouter.stack[2];

        expect(path).toBe('/multiplication');
        expect(methods).toMatchObject({ post: true});
    });

    it('Should have the /division path', () => {
        const { route: { path, methods }} = operationsRouter.stack[3];

        expect(path).toBe('/division');
        expect(methods).toMatchObject({ post: true});
    });
});