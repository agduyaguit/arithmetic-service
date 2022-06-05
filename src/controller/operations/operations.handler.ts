import { Request, Response, NextFunction } from 'express';
import operationService from './operations.service';

const addition = (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { body: { addend }} = req;
        const sum = operationService.addition(addend);
        return res.json({ sum });

    }catch(error){
        return next(error);
    }
};

const subtraction = (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { body: { minuend, subtrahend }} = req;
        const difference = operationService.subtraction(minuend, subtrahend);
        return res.json({difference});

    }catch(error){
        return next(error);
    }
};

const multiplication = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body: { multiplier, multiplicand }} = req;
        const product = operationService.multiplication(multiplier, multiplicand);
        return res.json({ product });
    }catch(error){
        return next(error);
    }
};

const division = (req: Request, res: Response, next: NextFunction) => {
    try {
        const {body: { numerator, denominator }} = req;
        const quotient = operationService.division(numerator, denominator);
        return res.json({quotient});
    }catch(error){
        return next(error);
    }
};

export default {
    addition,
    subtraction,
    multiplication,
    division
};