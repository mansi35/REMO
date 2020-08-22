var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);
    // var url = socket.handshake.headers.referer;
    // console.log(url.substring(27, url.length));
    // roomId = url.substring(27, url.length);
    //socket.join(roomId);
    var roomId = '12345';
    socket.on('create', function(room) {
        // console.log(room);
        socket.join(room);
        roomId = room;
    });

    socket.on('mouse', mouseMsg);

    function mouseMsg(data) {
        socket.to(roomId).emit('mouse', data);
        console.log(roomId);
    }
}