const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);
const client = require('./mysql');


router.post('/', async(req, res) => {
    let authNum = Math.random().toString().substr(2,6);
    let emailTemplete;

    client.query('UPDATE userInfo SET number=? WHERE userid=?', 
    [ authNum, req.body.userid ], () => {
        console.log("메일 인증 번호 삽입");
    });

    ejs.renderFile(appDir+'/template/authMail.ejs', {authCode : authNum}, function (err, data) {
        if(err) { console.error(err); }
        emailTemplete = data;
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        // port: ,
        secure: false,
        auth: {
            user: 'tmrwMaster@gmail.com',
            pass: 'tmrwsaturday83',
        },
    });

    let mailOptions = await transporter.sendMail({
        from: `내일은 토요일`,
        to: req.body.usermail,
        subject: '[ 내일은 토요일 ] 인증번호',
        html: emailTemplete,
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if(err) { console.error(err); }
        console.log("================[ Finish sending email ]=============== : " + info.response);
        res.send(authNum);
        transporter.close()
    });
});

router.post('/numcheck', (req, res) => {
    const inpId = req.body.id;
    const inpNum = req.body.num;

    client.query('use goom0803',()=>{
        console.log('데이터베이스 사용');
    });
    
    client.query('SELECT * FROM userInfo WHERE userid=?', [inpId], (err, sql_result) => {
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


module.exports=router;