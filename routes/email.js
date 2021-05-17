const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('./mysql');
const crypto = require('crypto');

const session = require('./session');
router.use(session);


router.get('/', (req, res) => {
    res.render('email');
});

router.post('/', (req, res) => {
    client.query('INSERT INTO email (userid, email, auth) VALUES (?, ?, ?)', 
    [req.session.userid, req.body.email, 'O'], (err) => {
        if(err) { console.error(err); }
    });
    res.redirect('/');
});


router.post('/check', (req, res) => {
    let inpEmail = req.body.email;

    client.query('use goom0803',()=>{
        console.log('데이터베이스 사용');
    });
    
    client.query('SELECT * FROM email WHERE email=?', [inpEmail], (err, sql_result) => {
        if(err) { console.error(err); }
        console.log('sql_result ==> ', sql_result);

        if(sql_result == "") {
            res.send({result: true});
            console.log("사용 가능 E-mail");
        }
        else {
            res.send({result: false});
            console.log("사용 불가 E-mail");
        }
    });
});


router.post('/numcheck', (req, res) => {
    let inpNum = req.body.num;

    client.query('use goom0803',()=>{
        console.log('데이터베이스 사용');
    });
    
    client.query('SELECT * FROM userInfo WHERE userid=?', [req.session.userid], (err, sql_result) => {
        if(err) { console.error(err); }
        console.log('sql_result ==> ', sql_result);

        if(inpNum == sql_result[0].number) {
            res.send({result: true});
            console.log("이메일 인증 성공");
        }
        else {
            res.send({result: false});
            console.log("이메일 인증 실패");
        }
    });
});

module.exports = router;
