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

export interface EndTurnMessage {
    action: string;
    amount?: number;
}

type GameStatus = 
    'WAITING' |
    'DEAL'    |
    'PREFLOP' |
    'FLOP'    |
    'TURN'    |
    'RIVER'   |
    'SHOWDOWN';

// TODO: Write function that takes subset of these fields and sends them to clients
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
    numTurnsCompleted: number;
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
            whoseTurn: undefined,
            numTurnsCompleted: 0
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
        game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], board: [...state.board]});

        socket.on('CHAT', function (message: string) {
            game.io.in(game.roomName).emit('CHAT', message);
        });

        socket.on('SIT_REQUEST', function (request: SitRequest) {
            game.addSitRequest(request);
            game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], board: [...state.board]});
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
                game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], board: [...state.board]});
            }
        });

        socket.on('DEAL_HAND', function() {
            // TODO: For right now, for debug purposes, everyone will be able to see
            // everyone else's hand. Eventually I want to make a special "debug mode"
            // option that will enable this.
            console.log('Dealing Hand');
            game.io.in(game.roomName).emit('CHAT', `New hand is dealt.`);
            //if (state.status === 'WAITING' || state.status === 'SHOWDOWN') {
                state.status = 'PREFLOP';
                game.shuffleDeck();
                for (const player of state.players) {
                    const hand = [game.state.deck.pop(), game.state.deck.pop()];
                    player.hand = hand;
                }
            //}
            game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], whoseTurn: state.whoseTurn, board: [...state.board]});

            // find out whose turn it is then send TURN_START message to that player
            //game.io.sockets.connected[socketId].emit('TURN_START', {});
        });

        socket.on('TURN_END', function(message: EndTurnMessage) {
            //TODO: verify message is coming from socket of player whose turn it is
            //TODO: This code SCREAMS for state machine
            const activePlayer = state.whoseTurn;
            const nextPlayer = game._getNextActivePlayer();
            const numPlayersInHand = state.players.filter((player: Player) => player.hand && player.hand.length > 0).length;
            state.whoseTurn = nextPlayer;
            state.numTurnsCompleted++;
            if (message.action == 'check') {
                console.log(`${activePlayer.name} checks.`);
                game.io.in(game.roomName).emit('CHAT', `${activePlayer.name} checks.`);
            }
            else if (message.action == 'fold') {
                console.log(`${activePlayer.name} folds.`);
                game.io.in(game.roomName).emit('CHAT', `${activePlayer.name} folds.`);
            }
            else if (message.action == 'call') {
                console.log(`${activePlayer.name} calls.`);
                game.io.in(game.roomName).emit('CHAT', `${activePlayer.name} calls.`);
            }

            if (state.numTurnsCompleted == numPlayersInHand) {
                state.numTurnsCompleted = 0;
                console.log('Round completed.');
                if (state.status === 'PREFLOP') {
                    state.status = 'FLOP';
                    state.board = [state.deck.pop(), state.deck.pop(), state.deck.pop()];
                    console.log(`Flop: ${state.board}`);
                    game.io.in(game.roomName).emit('CHAT', `Dealer deals the flop.`);
                }
                else if (state.status === 'FLOP') {
                    state.status = 'TURN';
                    state.board.push(state.deck.pop());
                    console.log(`Turn: ${state.board}`);
                    game.io.in(game.roomName).emit('CHAT', `Dealer deals the turn.`);
                }
                else if (state.status === 'TURN') {
                    state.status = 'RIVER';
                    state.board.push(state.deck.pop());
                    console.log(`River: ${state.board}`);
                    game.io.in(game.roomName).emit('CHAT', `Dealer deals the river.`);
                }
                else if (state.status === 'RIVER') {
                    state.status = 'SHOWDOWN';
                }
                else if (state.status === 'SHOWDOWN') {
                    state.board = [];
                    state.status = 'PREFLOP';
                    game.shuffleDeck();
                    for (const player of state.players) {
                        const hand = [game.state.deck.pop(), game.state.deck.pop()];
                        player.hand = hand;
                    }
                }
            }
            game.io.in(game.roomName).emit('TABLESYNC', {players: [...state.players], sitRequests: [...state.sitRequests], whoseTurn: nextPlayer, board: [...state.board]});
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
