const addition = ( addend: [] ): number  =>  {
    return addend.reduce((total: number, currentValue: number) => {
        return total + currentValue;
    }, 0);
};

const subtraction = (minuend: number, subtrahend: number): number => {
    return minuend - subtrahend;
};

const multiplication = (multiplier: number, multiplicand: number): number => {
    return multiplier * multiplicand;
};

const division = (numerator: number, denominator: number): number => {
    return numerator / denominator;
};

export default {
    addition,
    subtraction,
    multiplication,
    division
};