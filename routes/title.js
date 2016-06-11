var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/waitingRoom', function(req, res, next) {
    res.render('waitingRoom.ejs',{user:req.session.userid});
});

router.get('/title', function(req, res, next) {
    res.render('title');
});

router.get('/gameRoom:room',function(req,res){
    res.render('gameRoom.ejs',{room:req.params.room, user:req.session.userid});
});

module.exports = router;
