const router = require('express').Router();

const { restoreUser } = require('../../utils/auth');

router.use(restoreUser);



module.exports = router;
