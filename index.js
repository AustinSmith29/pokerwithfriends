const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const hostname = '127.0.0.1';
const port = 3000;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('A user has connected.');
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
