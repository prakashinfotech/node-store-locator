const { body } = require('express-validator');

const saveStoreValdation = [
    body('name').isLength({ min: 1 }).withMessage('Name cannot be empty.'),

    body('photo_url')
        .isLength({ min: 1 }).withMessage('Photo URL cannot be empty.')
        .isURL().withMessage('URL format is not correct.'),

    body('description').isLength({ min: 1 }).withMessage('Description cannot be empty.'),
    body('address').isLength({ min: 1 }).withMessage('Address cannot be empty.'),
];

module.exports = saveStoreValdation;