const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('./mysql');
const crypto = require('crypto');
const session = require('./session'); // 세션 사용때마다 하기

const IV_LENGTH = 16;
const key = '3nCrYptpaSSw0rds'; // 16byte

// 세션 사용할 때마다 세션을 사용한다고 해주기
router.use(session); 

function decrypt(text) {
    let textParts = text.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-128-cfb", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

router.get('/', (req, res) => {
  res.render('signin');
});

router.post('/', (req, res) => {
    const body = req.body;

    client.query('use goom0803', () => {
        console.log("데이터베이스 사용");
    });

    client.query('SELECT * FROM userInfo WHERE userid=?', [body.id], (err, result) => {
        if(err) { console.error(err); }
        console.log('아이디 검사 :: result ==> ', result);

        
        if(result == "") {
            res.send("<script>alert('ERROR : ID ERROR'); history.back();</script>");
        }
        else {
            const decipherPW = decrypt(result[0].pw);
            if(body.password == decipherPW) {
                console.log("good 로그인!");
                
                // 세션 추가
                req.session.userid = body.id;
                req.session.loggedin = true; 
                req.session.save(() => { 
                    res.render('index', {
                        id: req.session.userid,
                    });
                });
            }
            else {
                res.send("<script>alert('ERROR : Password ERROR'); history.back();</script>");
            }
        }
    });
});


module.exports = router;
