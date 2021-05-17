const express = require('express');
const router = express.Router();
const session = require('./session');
router.use(session);

router.get('/',(req,res)=>{
    const login = req.session.userid;
    console.log('login', login);
    res.render('header',{id: login});
});

module.exports = router;