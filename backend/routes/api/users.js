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

router.post('/', validateSignup, async (req, res) => {
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

    try {
        const user = await User.signup({ firstName, lastName, email, password, username });
    } catch (e) {
        return res.status(400).json({
            message: e.title,
            statusCode: 400,
            errors: e.errors
        });
    }

    await setTokenCookie(res, user);

    return res.json({
        user: user
    });
});

module.exports = router;
