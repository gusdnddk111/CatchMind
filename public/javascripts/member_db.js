    
var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');

var connection = mysql.createConnection({
    host     : '52.32.58.14',
    user     : 'root',
    password : '[784001]',
    database : '[catchmind]',
    port     : 3306
});


var self = module.exports = {

    //db에서 정답불러오기
    word:function(req,callback){
        console.log("Select Word");
        var result = Math.floor(Math.random() * 10) + 1;
        connection.query('SELECT * FROM answer Where id='+result, [], function (error, _rows, _cols) {
            if (error) {
                console.log("ERROR : " + error);
                return callback({result:false});
            }
            else {
                return callback({result:true, word:_rows[0].word});
            }
        });
    },

    //db에서 아이디가 맞는지 체크
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

    //회원가입 시 중복체크
    overlap: function (id, callback) {

        connection.query('SELECT NAME FROM info', [], function (error, _rows, _cols) {

            if (error) {
                console.log("ERROR : " + error);
                return callback("error");
            }

            for (var i = 0; i < _rows.length; ++i) {
                if (id == _rows[i].NAME) {
                    return callback(true);
                }
            }
            return callback(false);
        });
    },

    //회원가입
    add: function (member, callback) {
        self.overlap(member.id,function(result){
            if(result){
                console.log("member_db:ID is already exist");
                return callback("overlap");
            }
            else if(result == "error"){
                console.log("member_db: error");
                return callback(false);
            }
            else{
                var data = [member.id, member.password,"off"];

                connection.query("INSERT INTO info(NAME, PASSWORD,LOGON) VALUES (?,?,?)", data, function (err) {
                    if (!err) {
                        console.log("member_db:add success");
                        return callback(true);
                    }
                    else {
                        console.log("member_db:add fail");
                        return callback(false);
                    }
                });
            }
        });
    },

    //로그인
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

    //로그아웃(아직 안씀)
    logout: function (req,callback) {
        var update_query_str = "UPDATE info SET LOGON='off' WHERE NAME='" + member.NAME+"'";
        connection.query(update_query_str);
        callback("LogOut");
    },
    //현재 유저 수 카운트(아직안씀)
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