const express = require('express');
const router = express.Router();
const client = require('./mysql');
const moment = require('moment');

router.get('/', (req, res) => {
    client.query('SELECT * FROM reserve', (err, data) => {
        res.render('reservedlist', {
            data: data,
            moment: moment,
        });
    });
});

router.get('/:num', (req, res) => {
    console.log(req.params.num);
    let page = req.params.num;

    client.query('SELECT * FROM reserve order by idx desc', (error, result) => {
        res.render('reservedlist', { 
            data: result,
            page: page,
            leng: result.length-1,
            page_num: 10,
            moment: moment,
        });
    });
});

module.exports = router;