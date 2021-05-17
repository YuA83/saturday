const express = require('express');
const router = express.Router();
const client = require('./mysql');
const moment = require('moment');
const session = require('./session');
router.use(session);

router.get('/', (req, res) => {
    if(req.session.userid == undefined) {
        res.send("<script language=\"javascript\">alert('ERROR : permission denined'); location.replace('/signin');</script>");
    }
    else {
        client.query("SELECT userid, name, birth, tier, point FROM userInfo left join userpoint on userInfo.userid = userpoint.user_id WHERE userid=?", [req.session.userid], (err, data)=>{
            client.query('SELECT * FROM reserve WHERE userid=?', [req.session.userid], (err, data2) => {
                res.render('mypage', {
                    id: req.session.userid,
                    data: data[0],
                    data2 : data2,
                    moment: moment,
                });
            });
        });
    }
});


module.exports = router;
