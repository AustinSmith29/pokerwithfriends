import { GameState } from './gamestate';
import { SitRequest, PlayerAction, Player } from '../shared/interfaces';

const DEBUG = true;

interface PokerGameI {
    state: GameState;
    roomName: string;
    host: Player | undefined;
    password?: string;
    io: SocketIO.Server;
}

export class PokerGame implements PokerGameI {
    state: GameState;
    host: Player | undefined;
    password?: string;
    roomName: string;
    io: SocketIO.Server;

    constructor(smallBlind: number, bigBlind: number, startingStack: number, password: string, roomName: string, ioServer: SocketIO.Server) {
        this.state = new GameState(smallBlind, bigBlind);
        this.host = undefined;
        this.password = password;
        this.roomName = roomName;
        this.io = ioServer;
    }

    setHost(player: Player) {
        this.host = player;
    }

    bindHost(socketId: string) {
        this.host.socketId = socketId;
        this.state = this.state.seatPlayer(this.host);
    }

    addPlayerToLobby(socket: SocketIO.Socket) {
        const player: Player = { name: 'Watcher', stack: 0, hand: [], seat: undefined, status: 'LOBBY', socketId: socket.id };
        this.state = this.state.addPlayer(player);
    }

    tableSync(state: GameState) {
        this.io.in(this.roomName).emit('TABLESYNC', {
            players: [...state.state.players],
            sitRequests: [...state.state.sitRequests],
            whoseTurn: state.state.whoseTurn,
            board: [...state.state.board],
            dealer: state.state.dealer,
            smallBlind: state.state.smallBlind,
            bigBlind: state.state.bigBlind,
            bets: state.state.bets,
            pots: state.state.pots,
        });
    }

    addClient(socket: SocketIO.Socket)  {
        const game: PokerGame = this;
        let state: GameState = game.state;
        socket.leaveAll();
        socket.join(this.roomName);
        if (!this.host.socketId) {
            this.bindHost(socket.id);
        }
        else {
            this.addPlayerToLobby(socket);
        }
        game.tableSync(state);

        socket.on('CHAT', function (message: string) {
            if (message === 'dump') {
                let copy = {...state};
                delete copy.state.deck; // Takes up too much screen real estate
                console.log(copy);
            }
            else {
                game.io.in(game.roomName).emit('CHAT', message);
            }
        });

        socket.on('SIT_REQUEST', function (request: SitRequest) {
            state = state.addSitRequest(request);
            game.tableSync(state);
        });

        socket.on('SIT_ACCEPT', function(request: SitRequest) {
            state = state.acceptSitRequest(request);
            game.tableSync(state);
        });

        socket.on('START_GAME', function() {
            const players = state.state.players;
            const randomDealer = players[players.length * Math.random() | 0];
            state = state.startNewHand(randomDealer);
            game.tableSync(state);
        });

        socket.on('TURN_END', function(action: PlayerAction) {
            const whoSentMessage = state.state.players.find((player: Player) => player.socketId === socket.id);
            console.log(whoSentMessage);

            if (action.type == 'CHECK') {
                console.log('Check');
                state = state.doCheck(whoSentMessage);
            }
            else if (action.type == 'FOLD') {
                console.log('Fold');
                state = state.doFold(whoSentMessage);
            }
            else if (action.type == 'CALL') {
                console.log('Call');
                state = state.doCall(whoSentMessage);
            }
            else if (action.type == 'BET') {
                console.log('Bet');
                state = state.doBet(whoSentMessage, action.amount);
            }
            game.tableSync(state);
        });
    }
}

// The GameTable stores all the concurrent games the server is currently handling.
export class GameTable {
    games: Map<string, PokerGame>;

    constructor() {
        this.games = new Map();
    }

    addGameSession(roomName: string, game: PokerGame): void {
        if (this.games.has(roomName)) {
            throw new Error('Room name already in use!');
        }
        this.games.set(roomName, game);
    }

    removeGameSession(roomName: string): void {
        this.games.delete(roomName);
    }

    getGame(roomName: string): PokerGame | undefined {
        if (this.games.has(roomName)) {
            const game = this.games.get(roomName);
            return game;
        }
        return undefined;
    }
}
