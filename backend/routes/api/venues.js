const express = require('express');
const { Venue } = require('../../db/models');


const router = express.Router();

router.get('/', (req, res) => {
    res.json('hello :)');
});

module.exports = router;
