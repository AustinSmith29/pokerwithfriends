const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const hostname = '127.0.0.1';
const port = 3000;

app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('A user has connected.');
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
