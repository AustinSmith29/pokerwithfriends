import {Card} from './poker.js';

type PlayerStatus = 'LOBBY' | 'PLAYING' | 'STANDING';

export interface Player {
    name: string;
    stack: number;
    seat: number;
    socketId: string;
    status: PlayerStatus;
}


export interface SitRequest {
    name: string;
    seat: number;
    stack: number;
    socketId: string;
}

type GameStatus = 
    'WAITING' |
    'DEAL'    |
    'PREFLOP' |
    'FLOP'    |
    'TURN'    |
    'RIVER'   |
    'SHOWDOWN';

interface PokerGameState {
    players: Player[];
    deck: Card[];
    board: Card[];
    status: GameStatus;
    smallBlind: number;
    bigBlind: number;
    sitRequests: SitRequest[];
    lobby: SocketIO.Socket[];
}

interface PokerGameI {
    state: PokerGameState;
    roomName: string;
    host: Player | undefined;
    password?: string;
    io: SocketIO.Server;
}

export class PokerGame implements PokerGameI {
    state: PokerGameState;
    host: Player | undefined;
    password?: string;
    roomName: string;
    io: SocketIO.Server;

    constructor(smallBlind: number, bigBlind: number, startingStack: number, password: string, roomName: string, ioServer: SocketIO.Server) {
        this.state = {
            players: [],
            sitRequests: [],
            deck: [],
            board: [],
            smallBlind: smallBlind,
            bigBlind: bigBlind,
            status: 'WAITING',
            lobby: []
        };
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
        this.state.players.push(this.host);
    }

    addWatcher(socket: SocketIO.Socket) {
        this.state.lobby.push(socket);
    }

    addSitRequest(request: SitRequest) {
        this.state.sitRequests.push(request);
    }

    addClient(socket: SocketIO.Socket)  {

        const game: PokerGame = this;
        const state: PokerGameState = game.state;
        socket.leaveAll();
        socket.join(this.roomName);
        if (this.host.socketId) {
            this.addWatcher(socket);
        } else {
            this.bindHost(socket.id);
        }

        socket.on('SIT_REQUEST', function (request: SitRequest) {
            console.log(game.state);
            game.addSitRequest(request);
            console.log(request);
            console.log(socket.adapter)
            console.log(socket.adapter.rooms);
            game.io.in(this.roomName).emit('TABLESYNC', 'Test 123');
            game.io.in(socket.id).emit('TABLESYNC', 'Test 123');
        });

        socket.on('SIT_ACCEPT', function(request: SitRequest) {
            const existingRequests = state.sitRequests;
            if (existingRequests.find((req: SitRequest) => req.socketId === request.socketId)) {
                const player: Player = {
                    name: request.name,
                    stack: request.stack,
                    seat: request.seat,
                    socketId: request.socketId,
                    status: 'PLAYING'
                };
                game.seatPlayer(player);
                state.sitRequests = existingRequests.filter((req: SitRequest) => 
                    req.socketId !== request.socketId);
            }
        });

        socket.on('DEAL_HAND', function() {
            if (state.status === 'WAITING' || state.status === 'SHOWDOWN') {
                state.status = 'DEAL';
                // game.shuffleDeck();
                for (const player of state.players) {
                    // const hand = game.takeNCards(2);
                    // TODO: FINISH THIS SHIT
                }
            }
        });

    }

    seatPlayer(player: Player) {
        this.state.players.push(player);
    }

}

export class GameTable {
    constructor() {
        this.games = new Map();
    }

    games: Map<string, PokerGame>;

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
