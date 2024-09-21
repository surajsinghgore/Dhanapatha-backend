import { body } from 'express-validator';
export const registerValidation = [
    body('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.')
        .trim()
        .escape(),

    body('email')
        .isEmail().withMessage('Must be a valid email address.')
        .matches(/@gmail\.com$/).withMessage('Only Gmail accounts are allowed.')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
        .matches(/[0-9]/).withMessage('Password must contain at least one number.')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character.')
        .trim()
];