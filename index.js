const PORT = process.env.PORT || 5000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
app.use(express.static('client'));

let users = {};


io.on('connection', (socket) => {
    socket.on('enter', nickName => {
        console.log(`user ${nickName} connected`);
        users[socket.id] = nickName;
        io.emit('reloadListActiveUsers', users);
        io.emit('notifyNameConnectedUser', nickName);
    });

    socket.on('disconnect', () => {
        console.log(`user ${users[socket.id]} disconnected`);
        io.emit('notifyNameDisconnectedUser', users[socket.id]);
        delete users[socket.id];
        io.emit('sendListActiveUsers', users);
    });

    socket.on('sendMessageToServer', message => {
        io.emit('sendMessageToAllUsers', users, {nickName : users[socket.id], message : message});
    })
});
server.listen(PORT);
console.log('Server started');
