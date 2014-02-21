var express = require('express')
    , app = express()
    , server = require("http").createServer(app)
    , io = require('socket.io').listen(server)
    , users = []
    , helpers = require("./public/javascripts/helpers.js");

server.listen(80);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendors'));

app.get('/',function(req,res) {
  res.sendfile(__dirname + '/views/index.html');
});

io.sockets.on('connection', function(socket) {
  socket.on('send', function(data) {
      io.sockets.emit('send', data);
  });

  socket.on('sendPrivateMsg', function(data) {
      io.sockets.socket(data.user).emit('sendPrivateMsg', data.msg);
  });

  socket.on('addUser', function(data) {
      var name = data;
      socket.username = data;
      users.push({id: socket.id, name: data});
      socket.emit('setUserSocketId',socket.id);
      io.sockets.emit('userListUpdate', users);
  });

  socket.on('disconnect', function() {
      io.sockets.emit('send', {user: 'server', msg: socket.username +' left the chat.'});
      helpers.removeByAttr(users,'id',socket.id);
      io.sockets.emit('userListUpdate', users);
  });
});
