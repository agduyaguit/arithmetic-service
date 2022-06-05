const attribute = {
    subtraction: 'subtraction'
};

export default {
    $id: 'DivisionOperation',
    type: 'object',
    properties: {
        minuend: { type: 'number'},
        subtrahend: { type: 'number' },
    },
    required: ['minuend', 'subtrahend'],
    errorMessage: {
        type: `Invalid input ${attribute.subtraction}`,
    }
}