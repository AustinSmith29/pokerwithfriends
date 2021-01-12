import express from 'express';
import http from 'http';
import url from 'url';
import {GameTable, Player, PokerGame}from './server';

const io = require('socket.io')(http);

const HOSTNAME = '0.0.0.0';
const PORT = 3000;

const app = express();
app.use('/', express.static(__dirname + '/dist/'));
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);
io.listen(server);

const gameTable = new GameTable();
gameTable.addGameSession('Test', new PokerGame(10, 20, 1000, '', 'Test', io));
const player: Player = {name: 'TestHost', stack: 1000, seat: 0, socketId: undefined, status: 'PLAYING'};
gameTable.getGame('Test').setHost(player);

app.get('/', function(req, res) {
    res.sendFile('index.html', {root: __dirname + '/dist/'});
});

app.post('/', function(req, res) {
    const {gameType, roomName, action, ...rest} = req.body;
    if (action === 'create') {
        const game = new PokerGame(10, 20, 1000, '', roomName, io);
        console.log(`Creating room "${roomName}".`);
        gameTable.addGameSession(roomName, game);
        const {hostName, stack} = rest;
        const player: Player = {name: hostName, stack, seat: 0, socketId: undefined, status: 'PLAYING'};
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

io.on('connection', function(socket: SocketIO.Socket) {
    console.log('New socket connection');
    socket.on('JOIN', function(msg) {
        const game = gameTable.getGame(msg.roomName);
        game.addClient(socket);
    });
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
