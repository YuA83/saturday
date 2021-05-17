const express = require('express');
const router = express.Router();
const session = require('./session');
router.use(session);

router.get('/',(req,res) => {
    req.session.destroy();
    res.redirect('/');    
});

module.exports=router;