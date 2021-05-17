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
        client.query("SELECT userid, name, birth, tier, point FROM userInfo left join userpoint on userInfo.userid = userpoint.user_id WHERE userid not in ('admin')", (err, data)=>{
            res.render('users', {
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

    client.query("SELECT userid, name, birth, tier, point FROM userInfo left join userpoint on userInfo.userid = userpoint.user_id WHERE userid not in ('admin')", 
    (error, result) => {
        res.render('users', { 
            data: result,
            page: page,
            leng: result.length-1,
            page_num: 10,
            id: req.session.userid, 
            moment: moment,
        });
    });
});

router.get('/up/:userid', (req, res, next) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.params.userid], (err, result) => {
        let pointUp = result[0].point + 10;

        client.query('UPDATE userpoint SET point=? WHERE user_id=?', 
        [ pointUp, req.params.userid ], () => {
            console.log("특별 포인트 지급");
            res.redirect('/users/1');
        });
    });
});
router.post('/up/:userid', (req, res, next) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.params.userid], (err, result) => {
        if(err) console.error(err);

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
});

router.get('/down/:userid', (req, res, next) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.params.userid], (err, result) => {
        let pointDown = result[0].point - 10;

        if(result[0].point < 0) {
            res.send('<script>alert("ERROR");</script>');
            res.redirect('/users/1');
        }
        else {
            client.query('UPDATE userpoint SET point=? WHERE user_id=?', 
            [ pointDown, req.params.userid ], () => {
                console.log("포인트 삭감");
                res.redirect('/users/1');
            });
        }
    });
    next();
});

router.post('/down/:userid', (req, res, next) => {
    client.query('SELECT * FROM userpoint WHERE user_id=?', [req.params.userid], (err, result) => {
        if(err) console.error(err);

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
});

module.exports = router;