const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require('url');
const poker = require('./server.js');

const hostname = '0.0.0.0';
const port = 3000;

/*
app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/assets', express.static(__dirname + '/assets/'));
*/
app.use('/', express.static(__dirname + '/dist/'));
app.use(express.urlencoded({extended: true}));

const gameTable = new poker.GameTable();

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/dist/'});
});

app.post('/', function(req, res) {
    const {gameType, roomName, action, ...rest} = req.body;
    if (action === 'create') {
        console.log('Creating Game.');
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
    res.sendFile('game.html', {root: __dirname + '/dist/'});
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
        const game = gameTable.getGame(request.roomName);
        const sitRequest = game.state.sitRequests.find(req => req.socketId === request.socketId);
        if (!sitRequest) {
            console.log(`Error. Recieved request from ${request.socketId}`);
            return;
        }
        game.seatPlayer(poker.Player(sitRequest.name, sitRequest.stack, sitRequest.seat, request.socketId, status='PLAYING'));
        game.state.sitRequests = game.state.sitRequests.filter(req => req.socketId !== request.socketId);
        console.log(game.state);
        io.of('/game').emit('TABLESYNC', game.state);
    });

    socket.on('DEAL_HAND', function(request) {
        console.log('Dealing new hand.');
        const game = gameTable.getGame(request.roomName);
        game.state.status = poker.State.NEWHAND;
        console.log(`DEAL_HAND Request from ${socket.id}`);
        console.log(io.of('/game'));
        game.shuffleDeck();
        for (const player of game.state.players) {
            const hand = game.takeNCards(2);
            console.log(`Delt hand ${hand} to player with id ${player.socketId}.`);
            io.of('/game').connected[player.socketId].emit('NEWHAND', {hand});
        }
        io.of('/game').emit('TABLESYNC', game.state);
    });
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
