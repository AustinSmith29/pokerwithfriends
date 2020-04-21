const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require('url');

const hostname = '0.0.0.0';
const port = 3000;

app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/assets', express.static(__dirname + '/assets/'));
app.use(express.urlencoded({extended: true}));

// Maps string to a running game.
const gameTable = new Map();

const Player = (name, stack, seat, host=false, status='LOBBY') => {
    return {
        name: name,
        stack: stack,
        seat: seat,
        hand: [],
        status: status,
        host: host
    };
};

class GameHeader {
    constructor(game) {
        this.password = '';
        this.aliveFlag = true;
        this.game = game;
    }
}

const State = Object.freeze({
    WAITING: 0,
    NEWHAND: 1,
    DEAL: 2,
    PREFLOP: 3,
    FLOP: 4,
    TURN: 5,
    RIVER: 6,
    SHOWDOWN: 7
});

class CashGame {
    constructor({smallBlind, bigBlind, startingStack, hostName}) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.state = {
            players: [Player(hostName, startingStack, 0, true, 'SEATED')],
            cards: [],
            board: [],
            blinds: [],
            status: State.WAITING
        };
        this.host = null;
    }
}

class TournamentGame {
    constructor({numPlayers, duration}) {
        this.numPlayers = numPlayers;
        this.duration = duration;
    }
}

function createGame(gameType, params) {
    switch(gameType) {
        case 'cash':
            return new CashGame(params);
        case 'tournament':
            return new TournamentGame(params);
        default:
            error('Unknown Game!');
    }
}

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
    const {gameType, roomName, action, ...rest} = req.body;
    if (action === 'create') {
        const gameInfo = createGame(gameType, rest);
        const entry = new GameHeader(gameInfo);
        gameTable.set(roomName, entry);
    }
    res.redirect(url.format({
        pathname: '/game',
        query: {
            roomName: roomName
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
        socket.join(msg.roomName);
        if (!gameTable.get(msg.roomName).game.host) {
            gameTable.get(msg.roomName).game.host = {socket: socket};
        }
    });

    socket.on('SIT', function(request) {
        console.log('Sit request!');
        const game = gameTable.get(request.roomName).game;
        socket.to(game.host.socket.id).emit('SIT_REQUEST', request);
    });

    socket.on('SIT_ACCEPT', function(request) {
        const game = gameTable.get(request.roomName).game;
        game.state.players.push(Player(request.player, request.stack, request.seat));
        socket.to(request.roomName).emit('TABLESYNC', game.state);
    });
});

nsp.on('SIT', function(request) { 
});

nsp.on('SIT_ACCEPT', function(msg) {
});

nsp.on('SIT_REJECT', function(msg) {
});

http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
