const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('./mysql');
const crypto = require('crypto');

const IV_LENGTH = 16;
const key = '3nCrYptpaSSw0rds'; // 16byte

const session = require('./session');
router.use(session);


function encrypt(plainPW) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-128-cfb", Buffer.from(key), iv);
    let encrypted = cipher.update(plainPW);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}


router.get('/id', (req, res) => {
    res.render('forgotID');
});

router.post('/id', (req, res) => {
    const body = req.body;
    client.query('SELECT * FROM userInfo WHERE name=? AND birth=?', 
    [body.username, body.birth], (err, result) => {
        console.log(result);
        if(err) console.log(err);
        if(result.length == 0) {
            res.send("<script language=\"javascript\">alert('ERROR : NO Account'); history.back();</script>");
        }
        else {
            res.send(`<script language=\"javascript\">alert('SUCCESS : ID == ${result[0].userid}'); location.replace('/signin');</script>`);
        }
    });
});


router.get('/pw', (req, res) => {
    res.render('forgotPW');
});

router.post('/pw', (req, res) => {
    const body = req.body;
    client.query('SELECT * FROM email WHERE userid=? AND email=?', [body.id, body.email], (err, result) => {
        if(result.length == 0) {
            res.send("<script language=\"javascript\">alert('ERROR : NO Account'); location.replace('/forgot/pw');</script>");
        }
        else {
            res.send(`<script language=\"javascript\">location.replace('/forgot/resetpw/${body.id}');</script>`);
        }
    });
});


router.get('/resetpw/:userid', (req, res) => {
    const userid = req.params.userid;

    res.render('resetpw', {
        userid : userid,
    });
});

router.post('/resetpw/:userid', (req, res) => {
    console.log(req.params.userid);
    const body = req.body;
    const inId = req.params.userid;
    const encryptPW = encrypt(body.password);

    client.query('use goom0803',()=>{
        console.log('데이터베이스 사용');
    });

    client.query('UPDATE userInfo SET pw=? WHERE userid=?', [encryptPW, inId], () => {
        console.log("비밀번호 변경 완료");
        res.redirect('/signin');
    });
});


module.exports = router;