const fs  = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static(__dirname + '/src'));

let userList = [];
io.on('connection', socket => {
    socket.emit('success', '连接到服务器');

    socket.on('disconnect', () => {
        userList = userList.filter(item => item.userID != socket.id)
        io.emit('quit', socket.id)
    })

    socket.on('login', (userInfo) => {
        userList.push(userInfo);
        io.emit('userList', userList);
    })

    socket.on('sendMsg', (data) => {
        socket.to(data.id).emit('receiveMsg', data);
    })
})

http.listen(3002, () => {
    console.log('http://localhost:3002/index.html')
})