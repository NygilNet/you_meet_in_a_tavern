const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a first name.'),
    check('firstName')
        .not()
        .isEmail()
        .withMessage('First Name can not be an email.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a last name.'),
    check('lastName')
        .not()
        .isEmail()
        .withMessage('Last Name can not be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

const router = express.Router();

const signUpBodyValidation = (req, res, next) => {

    const errors = {};
    const { email, firstName, lastName, password } = req.body;

    if (!email.split('').includes('@')) errors.email = 'Invalid email';
    if (!firstName) errors.firstName = 'First Name is required';
    if (!lastName) errors.lastName = 'Last Name is required';
    if (!password) errors.password = 'Password is required';

    if(Object.keys(errors)[0]) return res.status(400).json({
        message: 'Validation error',
        statusCode: 400,
        errors
    });

    next();
}

router.post('/', signUpBodyValidation, validateSignup, async (req, res) => {
    let { firstName, lastName, email, password, username } = req.body;
    if (!username) username = `${firstName}${lastName},`

    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) return res.status(403).json({
        message: 'User already exists',
        statusCode: 403,
        errors: {
            email: 'User with that email already exists'
        }
    });


    let user;
    try {
        let signup = await User.signup({ firstName, lastName, email, password, username });
        user = signup;
    } catch (e) {
        return res.status(400).json({
            message: e.title,
            statusCode: 400,
            errors: e.errors
        });
    }

    await setTokenCookie(res, user);

    const results = {};
    results.id = user.id;
    results.firstName = user.firstName;
    results.lastName = user.lastName;
    results.email = user.email;

    return res.json(results);
});

module.exports = router;
