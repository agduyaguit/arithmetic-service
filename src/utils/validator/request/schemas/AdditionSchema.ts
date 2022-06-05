const attribute = {
    addend: 'addend'
};

export default {
    $id: 'AdditionOperation',
    type: 'object',
    properties: {
        addend: {
            type: 'array',
            items: {
                type: 'number'
            }
        }
    },
    required: ['addend'],
    errorMessage: {
        type: `Invalid input ${attribute.addend}`,
    }
}