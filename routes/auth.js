const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
var appDir = path.dirname(require.main.filename);
const client = require('./mysql');

const session = require('./session');
router.use(session);

router.get('/', (req, res) => {
    res.render('auth');
});

router.post('/', async(req, res) => {
    let authNum = Math.random().toString().substr(2,6);
    let emailTemplete;

    client.query('UPDATE userInfo SET number=? WHERE userid=?', 
    [ authNum, req.session.userid ], () => {
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
            pass: '',
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

module.exports=router;