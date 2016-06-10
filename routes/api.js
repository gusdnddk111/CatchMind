var signup = require('../public/javascripts/signup.js');
var login = require('../public/javascripts/login.js');
var member_db = require('../public/javascripts/member_db.js');
var express = require('express');

var app = express();


module.exports = function(app){
    app.post('/title/signup',function(req,res){
        signup.join(req,res);
    });

    app.post('/title/login',function(req,res){
        login.login(req,res);
    });
    
    app.post('/waitingRoom/editRoom',function(req,res){
        member_db.addRoom(req.body,res);
    });

    app.post('/waitingRoom/enterRoom',function(req,res){
        member_db.updateRoomInfo(req.body,res);
    });

    app.post('/gameRoom/exitRoom',function(req,res){
        member_db.exitRoom(req.body,res);
    });
    
};

process.on('uncaughtException', function (err) {
    console.log(err);
}); 