const attribute = {
    multiplication: 'multiplication'
};

export default {
    $id: 'MultiplicationOperation',
    type: 'object',
    properties: {
        multiplier: { type: 'number' },
        multiplicand: { type: 'number'},
    },
    required: ['multiplier', 'multiplicand'],
    errorMessage: {
        type: `Invalid input ${attribute.multiplication}`,
    }
}