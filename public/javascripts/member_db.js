    
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

    addRoom: function(req,res){
        var data = [req.roomnameInput,req.current_user_count,req.maxUserCount];
        console.log(data);
        connection.query("INSERT INTO roominfo(roomname, currentusercount, maxusercount) VALUES (?,?,?)", data, function (err) {
            connection.query("SELECT * FROM roominfo ORDER BY roomnum DESC LIMIT 1", [], function (error, _rows, _cols) {
                if (!err) {
                    console.log("member_db:Room add success");
                    if(!error){
                        console.log("member_db:Room read success");
                        res.json({result: true, room:_rows});
                    }
                    else{
                        console.log("member_db:Room read fail");
                        res.json({result: false});
                    }
                }
                else {
                    console.log("member_db:Room add fail");
                    res.json({result: false});
                }
            });
        });
    },



    updateRoomInfo:function(req,res){
        connection.query("SELECT maxusercount FROM roominfo WHERE roomnum="+req.roomnum,[], function (err, _rows, _cols) {
            if(_rows[0].maxusercount == req.currentusercount){
                return res.json({result:"full"});
            }
            else{
                var usernum=req.currentusercount*1+1;
                var query='UPDATE roominfo SET currentusercount='+ usernum + ' WHERE roomnum=' + req.roomnum;
                connection.query(query,function(error){
                    if (error) {
                        console.log("ERROR : " + error);
                        return res.json({result:false});
                    }
                    else{
                        return res.json({result:true});
                    }
                });
            }
        });
    },

    getMyRoom:function (req,callback) {

        connection.query('SELECT * FROM roominfo WHERE roomnum='+req,[], function (err, _rows, _cols) {
            if(err) {
                return callback({result:false});
            }
            else{
                return callback({result:true, roominfo:_rows});
            }
        });
    },

    readRoomInfo:function (req,callback) {

        connection.query('SELECT * FROM roominfo', [], function (error, _rows, _cols) {
            if (error) {
                if(_rows.length==0){
                    return callback(_rows);
                }
                console.log("ERROR : " + error);
                return callback(false);
            }
            else{
                return callback(_rows);
            }
        });
    },

    exitRoom:function (req,res) {
        connection.query("SELECT currentusercount FROM roominfo WHERE roomnum="+req.roomnum,[], function (err, _rows, _cols) {
            if(err) {
                return res.json({result:"read_fail"});
            }
            else{
                var usernum = _rows[0].currentusercount*1-1;

                if(usernum==0){
                    console.log("방파괴!");
                    connection.query("DELETE FROM roominfo WHERE roomnum="+req.roomnum,function(error){
                        if(error){
                            return res.json({result:"room_destroy_fail"});
                        }
                        else{
                            return res.json({result:true});
                        }
                    });
                }
                else{
                    console.log("방수정!");
                    var query='UPDATE roominfo SET currentusercount='+ usernum + ' WHERE roomnum=' + req.roomnum;
                    connection.query(query,function(error){
                        if (error) {
                            console.log("ERROR : " + error);
                            return res.json({result:"room_update_fail"});
                        }
                        else{
                            return res.json({result:true});
                        }
                    });
                }
            }
        });

    },
    
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