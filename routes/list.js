const express = require('express');
const router = express.Router();
const client = require('./mysql');
const moment = require('moment');

router.get('/', (req, res) => {
    client.query('SELECT * FROM reserve', (err, data) => {
        res.render('list', {
            data: data,
            moment: moment,
        });
    });
});

module.exports = router;
