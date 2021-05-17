const express = require('express');
const router = express.Router();
const client = require('./mysql');
const fs = require('fs');
const multer = require('multer');
const moment = require('moment');
const session = require('./session');
const path = require('path');
const bodyParser = require('body-parser');
router.use(session);


router.get('/insert', (req, res) => {
    if(req.session.userid == undefined) {
        res.send("<script language=\"javascript\">alert('ERROR : Please Login'); location.replace('/signin');</script>");
    }
    else {
        client.query('SELECT * FROM email WHERE userid=?', [req.session.userid], (err, result) => {
            console.log(result);
            if((result.length == 0) || (result[0].auth != 'O')) {
                res.send("<script language=\"javascript\">alert('User ERROR : Please auth your e-mail'); location.replace('/email');</script>");
            }
            else {
                res.render('insert', {
                    id: req.session.userid,
                });
            }
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.dirname(__dirname) + '/public/images/uploadImg')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().valueOf() + '' + file.originalname)
    },
    limit: { fileSize: 5 * 1024 * 1024 },
});

const upload = multer({ storage: storage });


router.post('/insert', upload.single('files'), (req, res) => {
    const body = req.body;
    console.log(req.file);

    if(req.file ==  undefined) {
        client.query('INSERT INTO board (userid, title, contents, views, date) VALUES (?,?,?,?,?)', 
        [ req.session.userid, body.title, body.contents, 0, new Date() ], () => { 
            console.log("게시글 데이터 삽입 - 이미지 없음");
            res.redirect('/review/1');
        });
    }
    else {
        client.query('INSERT INTO board (userid, title, contents, img, views, date) VALUES (?,?,?,?,?,?)', 
        [  req.session.userid, body.title, body.contents, req.file.filename, 0, new Date() ], (err, result) => { 
            if(err) { console.error(err); }
            console.log("게시글 데이터 삽입");
            res.redirect('/review/1');
        });
    }
});

router.get('/', (req, res) => {
    client.query('SELECT * FROM board order by idx desc', (err, data) => {
        res.render('review', {
            id: req.session.userid,
            data: data,
            moment: moment,
        });
    });    
});

router.get('/detail/:idx', (req, res) => {
    client.query('SELECT * FROM board WHERE idx=?', [req.params.idx], (err, result) => {
        if(err) { console.error(err); }
        
        const viewsUp = result[0].views + 1;
        client.query('UPDATE board SET views=? WHERE idx=?', [viewsUp, req.params.idx]);

        client.query('SELECT * FROM comments WHERE postid=?', [req.params.idx], (err, reresult) => {
            if(err) { console.error(err); }
            res.render('detail', { 
                data: result[0],
                data2: reresult,
                id: req.session.userid,
                moment: moment,
            });
        });
    });
});


router.get('/:num', (req, res) => {
    console.log(req.params.num);
    let page = req.params.num;

    client.query('SELECT * FROM board order by idx DESC ', (error, result) => {
        res.render('review', { 
            data: result,
            page:page,
            leng:result.length-1,
            page_num:10,
            logined : req.session.userid, 
            moment : moment,
        });
    });
});


router.get('/detail/edit/:idx', (req, res) => {
    client.query('SELECT * FROM board WHERE idx=?', [req.params.idx], (err, result) => {
        if(req.session.userid == result[0].userid) {
            console.log("게시글 수정");
            res.render('edit',{
                data : result[0],
                logined : req.session.userid,
            });
        }
        else {
            res.send("<script language=\"javascript\">alert('Request ERROR : permission denined'); location.replace('/review/1');</script>");
        }
    });
});

router.post('/detail/edit/:idx', (req, res) => {
    const body = req.body;
    console.log("게시글 수정 완료");

    client.query('UPDATE board SET title=?, contents=? WHERE idx=?', 
    [ body.title, body.contents, req.params.idx ], (err, result) => {
        if(err) { console.error(err); }
        console.log(result);
        res.redirect('/review/1');
    });
});


router.get('/detail/delete/:idx', (req, res) => {
    client.query('SELECT * FROM board WHERE idx=?', [req.params.idx], (err, result) => {
        if(req.session.userid == result[0].userid) {
            console.log("삭제");
        
            fs.unlink(path.dirname(__dirname) + '/public/images/uploadImg/' + result[0].img, (err) => {
                console.error(err);
                console.log("이미지 삭제 완료");
            });

            client.query('DELETE FROM board WHERE idx=?', [req.params.idx], () => {
                console.log("삭제 완료");
                res.redirect('/review/1');
            });
        }
        else {
            res.send("<script language=\"javascript\">alert('Request ERROR : permission denined'); location.replace('/review/1');</script>");
        }
    });
});


router.post('/detail/:idx/comments', (req, res) => {
    client.query('SELECT * FROM email WHERE userid=?', [req.session.userid], (err, result) => {
        if(result[0].auth != 'O') {
            res.send("<script language=\"javascript\">alert('User ERROR : Please auth your e-mail'); location.replace('/email');</script>");
        }
        else {
            client.query('INSERT INTO comments (postid, commenter, comment, date) VALUES (?,?,?,?)', 
            [ req.params.idx, req.session.userid, req.body.comment, new Date() ]);
            res.redirect('/review/detail/' + req.params.idx);
        }
    });
});


router.get('/detail/:postid/commentdel/:commentIdx', (req, res) => {
    client.query('SELECT * FROM comments WHERE commentIdx=?', [req.params.commentIdx], (err, result) => {
        if(req.session.userid == result[0].commenter) {
            console.log("삭제한다?");

            client.query('DELETE FROM comments WHERE commentIdx=?', [req.params.commentIdx], () => {
                console.log("삭제 완료");
                res.redirect('/review/detail/' + req.params.postid);
            });
        }
        else {
            res.send("<script language=\"javascript\">alert('Request ERROR : permission denined'); history.back();</script>");
        }
    });
});

module.exports = router;
