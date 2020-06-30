const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require('url');
const poker = require('./server.js');

const hostname = '0.0.0.0';
const port = 3000;

app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use(express.urlencoded({extended: true}));

const gameTable = new poker.GameTable();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
    const {gameType, roomName, action, ...rest} = req.body;
    if (action === 'create') {
        const game = poker.createGame(gameType, rest);
        gameTable.addGameSession(roomName, game);
        const {hostName, stack} = rest;
        const player = poker.Player(hostName, stack, 0, undefined, 'SEATED');
        game.setHost(player);
        console.log(rest);
    }
    res.redirect(url.format({
        pathname: '/game',
        query: {
            roomName: roomName,
        }
    }));
});

app.get('/game', function(req, res) {
    if (!req.query || !req.query.roomName) {
        res.redirect('/');
    }
    res.sendFile(__dirname + '/game.html');
});

const nsp = io.of('/game');
nsp.on('connection', function(socket) {
    socket.on('JOIN', function(msg) {
        console.log('A user has connected.');
        const game = gameTable.getGame(msg.roomName);
        socket.join(msg.roomName);
        if (game.host.socketId) {
            game.addWatcher(socket.id);
        } else {
            game.bindHost(socket.id);
            console.log('Host bound.');
        }
        console.log(game.state);
    });

    socket.on('SIT', function(request) {
        console.log('Sit request!');
        const game = gameTable.getGame(request.roomName);
        socket.to(game.host.socketId).emit('SIT_REQUEST', request);
    });

    socket.on('SIT_REQUEST', function(request) {
        const game = gameTable.get(request.roomName).game;
        if (socket.id === game.host) {
            console.log(`Received sit request with data ${request}`);
            socket.to(request.socketId).emit('SIT_ACCEPT');
        }
    });

    socket.on('SIT_ACCEPT', function(request) {
        const game = gameTable.get(request.roomName).game;
        game.state.players.push(Player(request.player, request.stack, request.seat));
        socket.to(request.roomName).emit('TABLESYNC', game.state);
    });
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
