const Player = (name, stack, seat, socketId, status='LOBBY') => {
    return {
        name: name,
        stack: stack,
        seat: seat,
        hand: [],
        status: status,
        socketId: socketId
    };
};

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
    constructor({smallBlind, bigBlind, startingStack, password}) {
        this.smallBlind = smallBlind;
        this.bigBlind = bigBlind;
        this.state = {
            players: [],
            lobby: [],
            cards: [],
            board: [],
            blinds: [],
            status: State.WAITING
       };
        this.host = undefined;
        this.password = password;
    }

    addWatcher(socketId) {
        this.state.lobby.push(socketId);
    }

    setHost(player) {
        this.host = player;
    }

    bindHost(socketId) {
        this.host.socketId = socketId;
        this.state.players.push({...this.host});
    }

    seatPlayer(player) {
       this.state.players.push(player);
    }
}

class TournamentGame {
    constructor({numPlayers, duration}) {
        this.numPlayers = numPlayers;
        this.duration = duration;
    }
}

class GameTable {
    constructor() {
        this.games = new Map();
    }

    addGameSession(roomName, game) {
        if (this.games.has(roomName)) {
            return null;
        }
        this.games.set(roomName, game);
    }

    removeGameSession(roomName) {
        this.games.delete(roomName);
    }

    getGame(roomName) {
        if (this.games.has(roomName)) {
            const game = this.games.get(roomName);
            return game;
        }
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

exports.createGame = createGame;
exports.GameTable = GameTable;
exports.Player = Player;
