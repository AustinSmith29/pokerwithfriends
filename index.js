const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = require('url');

const hostname = '0.0.0.0';
const port = 3000;

app.use('/scripts/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/scripts/phaser', express.static(__dirname + '/node_modules/phaser/dist/'));
app.use(express.urlencoded({extended: true}));

const Player = (name, stack, seat) => {
    return {
        name: name,
        stack: stack,
        seat: seat,
        hand: [],
        status: 'playing'
    };
};

class GameHeader {
    constructor(game) {
        this.id = null;
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
        this.players = [Player(hostName, startingStack)];
        this.state = State.NEWHAND
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
    const {gameType, roomName, rest} = req.body;
    // const gameInfo = createGame(gameType, rest);
    // const entry = new GameHeader(gameInfo);
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

io.on('connection', function(socket) {
    socket.on('join', function(msg) {
        console.log(`Player joined ${msg} room.`);
        socket.emit('pong', '');
    });
    console.log('A user has connected.');
});


http.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
