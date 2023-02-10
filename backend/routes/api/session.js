const express = require('express');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

const loginBodyValidation = (req, res, next) => {

    const errors = {};
    const { credential, password } = req.body;

    if (!credential) {
        errors.email = 'Email or username is required';
        errors.username = 'Email or username is required';
    }
    if (!password) errors.password = 'Password is required';

    if(Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors
    });

    next();
}

const router = express.Router();

router.post( '/', loginBodyValidation, async (req, res, next) => {
    const { credential, password } = req.body;


    const user = await User.login({ credential, password });

    if (!user) {
        return res.status(401).json({
            message: 'Invalid credentials',
            statusCode: 401
        });
    }

    await setTokenCookie(res, user);

    return res.json({
        user: user
    });
});

router.get('/', restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
        return res.json({
            user: user.toSafeObject()
        });
    } else return res.json({ user: null });
});

router.delete('/', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});

module.exports = router;
