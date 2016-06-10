var express = require('express');
var router = express.Router();
var room_db = require('../public/javascripts/member_db.js');


module.exports = router;
module.exports = function(app){
    app.get('/',function(req,res){
        res.render('title', {title:'title'})
    });
    
    app.get('/waitingRoom/getRoom',function(req,res){
        room_db.readRoomInfo(req, function (room) {
           if(room){
               res.json({result:true, room:room});
           }else{
               res.json({result:false});
           }
        });
    });
    
}