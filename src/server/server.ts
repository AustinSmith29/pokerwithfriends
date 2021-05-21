import { GameState } from './gamestate';
import { ServerPlayer } from './types';
import { SitRequest, PlayerAction, Card } from '../shared/interfaces';

const DEBUG = true;

interface PokerGameI {
    state: GameState;
    roomName: string;
    host: ServerPlayer | undefined;
    password?: string;
    io: SocketIO.Server;
}

export class PokerGame implements PokerGameI {
    state: GameState;
    host: ServerPlayer | undefined;
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

    setHost(player: ServerPlayer) {
        this.host = player;
    }

    bindHost(socketId: string) {
        this.host.socketId = socketId;
        this.state = this.state.seatPlayer(this.host);
    }

    tableSync() {
        this.io.in(this.roomName).emit('TABLESYNC', {
            players: [...this.state.state.players],
            sitRequests: [...this.state.state.sitRequests],
            whoseTurn: this.state.state.whoseTurn,
            board: [...this.state.state.board],
            dealer: this.state.state.dealer,
            smallBlind: this.state.state.smallBlind,
            bigBlind: this.state.state.bigBlind,
            bets: this.state.state.bets,
            pots: this.state.state.pots,
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
        game.tableSync();

        socket.on('CHAT', function (message: string) {
            console.log(message.substr(0, 5));
            if (message === 'dump') {
                game.io.sockets.connected[socket.id].emit('CHAT', JSON.stringify(state));
                console.log(state);
            }
            else {
                game.io.in(game.roomName).emit('CHAT', message);
            }
        });

        socket.on('SIT_REQUEST', function (request: SitRequest) {
            state = state.addSitRequest(request);
            game.tableSync();
        });

        socket.on('SIT_ACCEPT', function(request: SitRequest) {
            state = state.acceptSitRequest(request);
            game.tableSync();
        });

        socket.on('DEAL_HAND', function() {
            state = state.startNewHand();
        });

        socket.on('TURN_END', function(action: PlayerAction) {
            const whoSentMessage = state.players.find((player: ServerPlayer) => player.socketId === socket.id);

            if (action.action == 'check') {
                state = state.doCheck(whoSentMessage);
            }
            else if (action.action == 'fold') {
                state = state.doFold(whoSentMessage);
            }
            else if (action.action == 'call') {
                state = state.doCall(whoSentMessage);
            }
            else if (action.action == 'bet') {
                state = state.doBet(whoSentMessage, action.amount);
            }
            game.tableSync();
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
