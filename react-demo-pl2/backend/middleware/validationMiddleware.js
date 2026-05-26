const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('name').notEmpty().withMessage('Nome é obrigatório').isLength({ min: 2 }),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Password deve ter pelo menos 6 caracteres'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password é obrigatória'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdateProfile = [
    body('name').optional().isLength({ min: 2 }),
    body('phone').optional(),
    body('institution').optional(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateRegister, validateLogin, validateUpdateProfile };