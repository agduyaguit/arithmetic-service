import operationService from '../operations.service';

describe('Service Test Suite', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should add all the numbers in the array', () => {
        const arr = [1, 2];
        const sum = operationService.addition(arr);
        expect(sum).toBe(3);
    });

    it('Should subtract the given numbers', () => {
        const num1 = 10;
        const num2 = 3
        const difference = operationService.subtraction(num1, num2);
        expect(difference).toBe(7);
    });

    it('Should multiple the given numbers', () => {
        const num1 = 10;
        const num2 = 3
        const product = operationService.multiplication(num1, num2);
        expect(product).toBe(30);
    });

    it('Should division the given numbers', () => {
        const num1 = 9;
        const num2 = 3
        const quotient = operationService.division(num1, num2);
        expect(quotient).toBe(3);
    });
});