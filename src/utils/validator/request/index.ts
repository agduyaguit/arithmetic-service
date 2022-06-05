import Ajv from 'ajv'
import _ from 'lodash';
import ajvErrorsPlugins from 'ajv-errors';

import Schemas from './schemas';


const ajv = new Ajv({
    allErrors: true,
    schemas: Schemas
});

ajvErrorsPlugins(ajv);

export const isArrayAttribute = (attribute) => {
    const attributes = `${attribute}`.split('/');
    const assumeANumber = parseInt(attributes[1], 10);
    return Number.isInteger(assumeANumber);
}

export const ajvErrorsFormatter = (ajvError) => {
    const keyword = _.get(ajvError, 'keyword', '');

    if(`${keyword}`.indexOf('errorMessage') === -1) {
        const e = new Error('AJV error message not implemented');
        throw e;
    }

    let attribute = `${ajvError.instancePath}`.replace('/', '');
    if(isArrayAttribute(attribute)){
        attribute = `${attribute}`.replace(/\//gi, '.');
    }
    if(_.isEmpty(attribute)){
        const errorParams = _.get(ajvError, 'params.errors.0.params');
        attribute = _.defaultTo(_.values(errorParams)[0], 'Unknown');
    }

    return {
        attribute,
        message: _.get(ajvError, 'message', 'Error message unrecognize')
    }
}

const validate = async(name, data) => {
    const { schema } = ajv.getSchema(name);
    const isAsync = _.get(schema, '$async', false);

    let isValid;
    let ajvErrors = [];

    if(isAsync) {
        try {
            isValid = await ajv.validate(name, data)
        }catch(e: any){
            ajvErrors = e.errors;
            return false;
        };
    } else {
        isValid = ajv.validate(name, data);
        ajvErrors = ajv.errors;
    }

    if( isValid ) return false;

    const errors = {};
    ajvErrors.forEach(val => {
        const error = ajvErrorsFormatter(val);

        if(!errors[error.attribute]) {
            errors[error.attribute] = [];
        }

        if(`${error.message}`.length > 0) {
            errors[error.attribute].push(error.message);
        }
    });

    return errors;
};

const ValidateReq = (type, name) => async (req, res, next) => {
    try {
        const dataType = _.get(req, type, {});
        const data = { ...dataType }

        const error = await validate(name, data);

        if(!_.isEmpty(error)) {
            return res
                .status(422)
                .json({ success: false, message: 'The given data is invalid', error});
        }
        
        return next();
    }catch(e) {
        console.info(`Error: Request validate failed - ${e}`);
        return res  
            .status(500)
            .json({ success: false, message: 'Server Error'});
    }
};

export default ValidateReq;