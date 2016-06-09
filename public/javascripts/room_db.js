var fs = require('fs');
var ejs = require('ejs');
var http = require('http');
var mysql = require('mysql');
var express = require('express');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '784001',
    database : 'userinfo'
});



connection.connect(function(err){
    if(err){
        console.error("mysql connection error");
        console.log(err);
        throw err;
    }
});

module.exports = {

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

    }
}