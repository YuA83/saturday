const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('./mysql');
const crypto = require('crypto');

const session = require('./session');
router.use(session);

const IV_LENGTH = 16;
const key = '3nCrYptpaSSw0rds'; // 16byte

function encrypt(plainPW) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-128-cfb", Buffer.from(key), iv);
    let encrypted = cipher.update(plainPW);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', (req, res) => {
    const body = req.body;
    const encryptPW = encrypt(body.password);

    client.query('use goom0803',()=>{
        console.log('데이터베이스 사용');
    });

    client.query('INSERT INTO userInfo (userid, pw, name, birth) VALUES (?, ?, ?, ?)', 
    [ body.id, encryptPW, body.name, body.birth ], () => {
        console.log('계정 데이터 삽입 성공');
    });

    client.query('INSERT INTO userpoint VALUES (?, ?, ?)', 
    [ body.id, '알쓰', 0 ], () => {
        console.log('포인트 데이터 삽입 성공');
    });

    req.session.userid = body.id;
    req.session.loggedin = true; // 로그인 유지상태
    req.session.save(() => { // 세션을 저장
        res.render('email', {
            id: req.session.userid,
        });
    });
});


router.post('/checkID', (req, res) => {
    let inp_id = req.body.data;

    client.query('use goom0803',()=>{
        console.log("데이터베이스 사용");
    });

    client.query('SELECT * FROM userInfo WHERE userid=?', [inp_id], (err, sql_result) => {
        if(err) { console.error(err); }
        console.log('sql_result ==> ',sql_result);

        if(sql_result == "") {
            res.send({result: true});
            console.log("사용 가능 ID");
        }
        else {
            res.send({result: false});
            console.log("사용 불가 ID");
        }
    });
});

module.exports = router;
