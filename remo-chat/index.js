const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', function(socket) {
    var roomId = '12';
    socket.on('create', function(room) {
        //console.log(room);
        socket.join(room);
        roomId = room;
    });
    socket.on('chat_message', function(data) {
        socket.to(roomId).emit("chat_message", "<ol id='who'>" + "<b id='name'>" + data.username + "</b>" + "<br>" + data.message + "</ol>");
    });
});

//http.listen(port);
http.listen(port, function() {
    console.log('listening on localhost:3000');
});