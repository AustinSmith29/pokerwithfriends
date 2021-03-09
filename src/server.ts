import {Card, createDeck} from './poker';

type PlayerStatus = 'LOBBY' | 'PLAYING' | 'FOLD' | 'STANDING';

export interface Player {
    name: string;
    stack: number;
    seat: number;
    socketId: string;
    status: PlayerStatus;
    hand?: Card[];
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
    dealerPosition: number;
    whoseTurn?: Player;
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
            lobby: [],
            dealerPosition: 0,
            whoseTurn: undefined
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
        this.state.whoseTurn = this.host;
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
        game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests]});

        socket.on('SIT_REQUEST', function (request: SitRequest) {
            game.addSitRequest(request);
            game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests]});
        });

        socket.on('SIT_ACCEPT', function(request: SitRequest) {
            const existingRequests = state.sitRequests;
            const matchingRequest = existingRequests.find(req => req.socketId === request.socketId);
            
            if (matchingRequest) {
                const player: Player = {
                    name: request.name,
                    stack: request.stack,
                    seat: request.seat,
                    socketId: request.socketId,
                    status: 'PLAYING'
                };
                state.players.push(player);
                state.sitRequests = existingRequests.filter((req: SitRequest) => 
                    req.socketId !== request.socketId);
                game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests]});
            }
        });

        socket.on('DEAL_HAND', function() {
            // TODO: For right now, for debug purposes, everyone will be able to see
            // everyone else's hand. Eventually I want to make a special "debug mode"
            // option that will enable this.
            console.log('Dealing Hand');
            if (state.status === 'WAITING' || state.status === 'SHOWDOWN') {
                state.status = 'DEAL';
                game.shuffleDeck();
                for (const player of state.players) {
                    const hand = [game.state.deck.pop(), game.state.deck.pop()];
                    const socketId = player.socketId;
                    player.hand = hand;
                }
            }
            game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], whoseTurn: state.whoseTurn});

            // find out whose turn it is then send TURN_START message to that player
            //game.io.sockets.connected[socketId].emit('TURN_START', {});
        });

        socket.on('TURN_END', function() {
            // verify message is coming from socket of player whose turn it is
            const activePlayer = state.whoseTurn;
            if (activePlayer.socketId === socket.id) {
                const nextPlayer = game._getNextActivePlayer();
                state.whoseTurn = nextPlayer;
                game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], whoseTurn: nextPlayer});
                // update state
                // tablesync
                // if more players to act
                //      send next player TURN_START message
                // else
                //      advance to next round
            }
        });
    }

    _getNextActivePlayer(): Player {
        const playerSorter = (a: Player, b: Player) => {
            if (a.seat < b.seat) {
                return -1;
            }
            if (a.seat > b.seat) {
                return 1;
            }
            return 0;
        };
        const playersInSeatOrder = [...this.state.players].sort(playerSorter);
        const activePlayerIndex = playersInSeatOrder.findIndex(player => player === this.state.whoseTurn);
        const nextPlayer = playersInSeatOrder[(activePlayerIndex + 1) % playersInSeatOrder.length];
        return nextPlayer;
    }

    shuffleDeck() {
        this.state.deck = createDeck();
        this.state.deck.sort(() => Math.random() - 0.5);
    }

}

// The GameTable stores all the concurrent games the server is currently handling.
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
