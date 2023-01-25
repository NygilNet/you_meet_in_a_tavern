const router = require('express').Router();

const sessionRouter = require('./session');
const usersRouter = require('./users');
const groupsRouter = require('./groups');
const venuesRouter = require('./venues');
const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/venues', venuesRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});


module.exports = router;
