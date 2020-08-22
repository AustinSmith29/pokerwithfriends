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
        const game = gameTable.getGame(msg.roomName);
        socket.join(msg.roomName);
        if (game.host.socketId) {
            console.log('Player has joined lobby.');
            game.addWatcher(socket.id);
        } else {
            console.log('Host has joined');
            game.bindHost(socket.id);
        }

        socket.emit('TABLESYNC', game.state);
        io.of('/game').emit('TABLESYNC', game.state);
        console.log('Broacast state');
    });

    socket.on('SIT', function(request) {
        console.log('Sit request!');
        const game = gameTable.getGame(request.roomName);
        console.log(`Sending request to host ${game.host.name} with socketId ${game.host.socketId}`);
        socket.to(game.host.socketId).emit('SIT_REQUEST', request);
    });

    socket.on('SIT_REQUEST', function(request) {
        console.log(`Received sit request with data ${request}`);
        const game = gameTable.getGame(request.roomName);
        game.addSitRequest(socket.id, request);
        io.of('/game').emit('TABLESYNC', game.state);
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
