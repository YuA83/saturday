const express = require('express');
const moment = require('moment');
const router = express.Router();
const client = require('./mysql');
const session = require('./session');
router.use(session);

router.get('/', (req, res) => {
    if(req.session.userid == undefined) {
        res.send("<script language=\"javascript\">alert('ERROR : Please Login'); location.replace('/signin');</script>");
    }
    else {
        client.query('SELECT * FROM email WHERE userid=?', [req.session.userid], (err, result) => {
            if((result.length == 0) || (result[0].auth != 'O')) {
                res.send("<script language=\"javascript\">alert('User ERROR : Please auth your e-mail'); location.replace('/email');</script>");
            }
            else {
                client.query('SELECT * FROM userpoint WHERE user_id=?', [req.session.userid], (err, result) => {
                    if(err) { console.error(err); }
                    if(result[0].tier == 'BLOCK') {
                        res.send("<script language=\"javascript\">alert('ERROR : permission denined'); history.back();</script>");
                    }
                    else {
                        res.render('reserve');
                    }
                });
            }
        });
    }
});

router.post('/', (req, res, next) => {
    const body = req.body
    client.query('INSERT INTO reserve (userid, title, date, people, level, birth) VALUES (?, ?, ?, ?, ?, ?)', 
    [req.session.userid, body.title, body.date, body.peopleNum, body.drunkLevel, body.isBirth], () => {
        console.log(req.session.userid);
        console.log('예약 데이터 삽입 성공');
        next();
    });
});

router.post('/', (req, res, next) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.session.userid], (err, result) => {
        if(err) { console.error(err); }
        console.log('result ==> ', result);
        console.log('point ==> ', result[0].point);

        let incPoint = result[0].point + 5;

        client.query('UPDATE userpoint SET point=? WHERE user_id=?', [incPoint, req.session.userid], () => {
            console.log('포인트 지급 성공');
            next();
        });
    });
});

router.post('/', (req, res) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.session.userid], (err, result) => {
        if(err) { console.error(err); }

        const userpoint = result[0].point;
        const sql_update = 'UPDATE userpoint SET tier=? WHERE user_id=?';
        console.log("userpoint=====>", userpoint);
        
        if(25 <= userpoint && userpoint < 55) {
            client.query(sql_update, ['일반인', req.session.userid], () => {console.log("2단계로 상승");});
        }
        else if(55 <= userpoint && userpoint < 100) {    
            client.query(sql_update, ['술의 정령', req.session.userid], () => {console.log("3단계로 상승");});
        }
        else if(100 <= userpoint && userpoint < 155) {
            client.query(sql_update, ['술의 왕', req.session.userid], () => {console.log("4단계로 상승");});
        }
        else if(155 < userpoint) {          
            client.query(sql_update, ['디오니소스', req.session.userid], () => {console.log("5단계로 상승");});
        }
    });
    res.redirect('/reservedlist');
});


router.post('/checkDate', (req, res) => {
    const today = new Date().toISOString().split("T");
    const inpDate = req.body.inpDate;
    const mo_inpDate = moment(inpDate).format('YYYY.MM.DD');
    
    client.query('SELECT * FROM reserve', (err, sql_result) => {
        let reservedDate = [];
        
        console.log(reservedDate);
        for(let i = 0; i < sql_result.length; i++) {
            reservedDate.push(moment(sql_result[i].date).format('YYYY.MM.DD'));
        }
        console.log(reservedDate);
        
        if(reservedDate.indexOf(mo_inpDate) != -1) {
            res.send({result: 'dupply'});
            console.log('[server] 이미 예약된 날짜');
        }
        else if(inpDate < today[0]) {
            res.send({result: 'passed'});
            console.log('[server] 과거에서 오셨습니가');
        }
        else {
            res.send({result: 'ok'});
            console.log('[server] 날짜 통과')
        }
    });
});


module.exports = router;
