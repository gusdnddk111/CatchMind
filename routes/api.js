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
};

process.on('uncaughtException', function (err) {
    console.log(err);
}); 