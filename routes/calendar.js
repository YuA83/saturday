const express = require('express');
const router = express.Router();
const client = require('./mysql');
const moment = require('moment');

router.get('/', (req, res) => {
  client.query('select * from reserve',(err,data)=>{
      res.render('calendar',{
        data: data,
        len: data.length,
        moment: moment,
      });
  });
});


module.exports = router;
