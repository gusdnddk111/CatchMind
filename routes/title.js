var express = require('express');
var router = express.Router();
var room_db = require('../public/javascripts/room_db.js');

/* GET users listing. */
router.get('/waitingRoom', function(req, res, next) {
    res.render('waitingRoom.ejs',{user:req.session.userid});
});

router.get('/title', function(req, res, next) {
    res.render('title');
});

router.get('/gameRoom:room',function(req,res){
    room_db.getMyRoom(req.params.room,function(result){
        if(result.result===true){
            res.render('gameRoom.ejs',{room:req.params.room, user:req.session.userid, roommax:result.roominfo[0].maxusercount});   
        }else{
            res.render('waitingRoom.ejs',{user:req.session.userid});
        }
    });
});

module.exports = router;
