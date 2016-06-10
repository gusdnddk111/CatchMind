
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');


var connection = mysql.createConnection({
        host     : 'us-cdbr-iron-east-04.cleardb.net',
        user     : 'baecb20311ffc0',
        password : '06a3e36784d4d6f',
        database : 'heroku_b9321d6b1f34f5f',
        port     : 3306
});

var self = module.exports = {

    check:function(id, callback){
        console.log("check");
        connection.query('SELECT * FROM info', [], function (error, _rows, _cols) {
            if (error) {
                console.log("ERROR : " + error);
                callback(false);
            }
            else {
                for (var i = 0; i < _rows.length; ++i) {
                    if (id == _rows[i].NAME) {
                        callback(_rows[i]);
                    }
                }
                callback(false);
            }
        });
    },

    overlap: function (id, callback) {

        connection.query('SELECT NAME FROM info', [], function (error, _rows, _cols) {

            if (error) {
                console.log("ERROR : " + error);
                callback(true);
            }

            for (var i = 0; i < _rows.length; ++i) {
                if (id == _rows[i].NAME) {
                    callback(true);
                }
            }
            callback(false);
        });
    },

    add: function (member, callback) {

        self.overlap(member.id,function(result){
            if(result){
                console.log("member_db:ID is already exist");
                callback("overlap");
            }
            else{
                var data = [member.id, member.password,"off"];

                connection.query("INSERT INTO info(NAME, PASSWORD,LOGON) VALUES (?,?,?)", data, function (err) {
                    if (!err) {
                        console.log("member_db:add success");
                        callback(true);
                    }
                    else {
                        console.log("member_db:add fail");
                        callback(false);
                    }
                });
            }
        });
    },

    login: function (req,callback) {
        
        self.check(req.id, function(member){
            if(member){
                if(req.password == member.PASSWORD){
                    var update_query_str = "UPDATE info SET LOGON='on' WHERE NAME='" + member.NAME+"'";
                    connection.query(update_query_str);
                    return callback({result:true, user:member});
                }
                else{
                    return callback({result:false,message:"패스워드가 일치하지 않습니다."});
                }
            }else{
                return callback({result:false,message:"존재하지 않는 회원입니다."});
            }
        });
    },

    logout: function (req,callback) {
        var update_query_str = "UPDATE info SET LOGON='off' WHERE NAME='" + member.NAME+"'";
        connection.query(update_query_str);
        callback("LogOut");
    },

    LoginCount: function (req,callback){
        connection.query('SELECT * FROM info WHERE LOGON="on"', [], function (error, _rows, _cols) {
            if (error) {
                console.log("ERROR : " + error);
                callback(false);
            }
            callback(_rows.length);
        });
    }
}