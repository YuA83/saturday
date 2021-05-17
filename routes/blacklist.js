const express = require('express');
const router = express.Router();
const client = require('./mysql');
const moment = require('moment');
const session = require('./session');
router.use(session);

router.get('/', (req, res) => {
    if(req.session.userid != 'admin') {
        res.send("<script language=\"javascript\">alert('ERROR : permission denined'); location.replace('/');</script>");
    }
    else {
        client.query("SELECT * FROM blacklist", (err, data)=>{
            res.render('blacklist', {
                id: req.session.userid,
                data: data,
                moment: moment,
            });
        });
    }
});

router.get('/:num', (req, res) => {
    console.log(req.params.num);
    let page = req.params.num;

    client.query('SELECT * FROM blacklist', (error, result) => {
        res.render('blacklist', { 
            data: result,
            page: page,
            leng: result.length-1,
            page_num: 10,
            id: req.session.userid, 
            moment: moment,
        });
    });
});

router.get('/delete/:userid', (req, res) => {
    client.query('DELETE FROM blacklist WHERE userid=?', [req.params.userid], () => {
        console.log('======[', req.params.userid,']======블랙리스트에서 제외 ');
    });

    client.query('UPDATE userpoint SET tier=? WHERE user_id=?',
    [ '알쓰', req.params.userid ], () => {
        console.log("블랙리스트에서 제외- 다시 바닥부터 시작");
    });

    res.redirect('/blacklist/1');
});

router.post('/:userid', (req, res) => {
    client.query('SELECT * FROM userInfo WHERE userid=?', [req.params.userid], (err, result) => {
        client.query('INSERT INTO blacklist VALUES (?, ?, ?)',
        [ result[0].userid, result[0].name, result[0].birth ], () => {
            console.log("블랙리스트 정보 입력 완료");
        });

        client.query('UPDATE userpoint SET tier=?, point=? WHERE user_id=?',
        [ 'BLOCK', 0, req.params.userid ], () => {
            console.log("포인트 및 등급 수구바위");
        });

        res.redirect('/users/1');
    });
});

module.exports = router;
