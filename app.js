var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');

var title = require('./routes/title');
var adr = require('./routes/adr.js');
var api = require('./routes/api.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'<myself>',
  saveUninitialized:true,
  resave:true
}));

app.use('/', title);
adr(app);
api(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app);

server.listen(3000);

var io = require('socket.io').listen(server);

var rooms = [];
var count=0;

io.sockets.on('connection', function (socket) {
  console.log("socket connected!");

  socket.on('joinroom',function(data) {
    var room = data.room;
    var name = data.userid;

    // Create Room
    if (rooms[room] == undefined) {
      count = 1;
      var obj={id:name, position:count, host:true};
      console.log('room create :' + room);
      rooms[room] = new Object();
      rooms[room].users=[];
      rooms[room].users.push(obj);
    }
    else{
      var obj={id:name, position:count, host:false};
      rooms[room].users.push(obj);
    }
    if (count == 8) {count = 1;}
    else {count++;}
    
    socket.join(room);
    console.log(room+"번 방에 "+ rooms[room].users[rooms[room].users.length-1].id +" 입장");
    
    io.sockets.in(room).emit('userlist', {users: rooms[room].users});

  });

  socket.on('toServer', function (data) {
    var position=0;
    for(var i=0;i<rooms[data.room].users.length;i++){
      if(rooms[data.room].users[i].id == data.id){
        position=i+1;
        break;
      } 
    }
    console.log(data.room+"번방의 클라이언트들에게 "+ position+"이: " + data.message);
    io.sockets.in(data.room).emit('toClient',{msg:data.message,position:position});
  });

  socket.on('disconnect1',function(data) {
    var room = data.room;
      for(var i=0; i<rooms[room].users.length;i++){
        if(data.id == rooms[room].users[i].id){
          console.log(rooms[room].users[i].id+"disconnected");
          delete rooms[room].users[i];
          break;
        }
      }
    console.log(rooms[room].users);
    io.sockets.in(room).emit('userlist', {users: rooms[room].users});
  });
  
  socket.on('toServerImg',function(data){
    io.sockets.in(data.room).emit('toClientImg',{imgData:data.img});
  })
});

  module.exports = app;