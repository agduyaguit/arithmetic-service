const attribute = {
    division: 'division'
};

export default {
    $id: 'DivisionOperation',
    type: 'object',
    properties: {
        numerator: { type: 'number', exclusiveMinimum: 0 },
        denomenator: { type: 'number', exclusiveMinimum: 1 },
    },
    required: ['numerator', 'denomenator'],
    errorMessage: {
        type: `Invalid input ${attribute.division}`,
    }
}