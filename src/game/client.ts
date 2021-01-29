import {Player, SitRequest} from '../server';

const io = require('socket.io-client');

export interface GameState {
    players: Player[];
    sitRequests: SitRequest[];
    hand: [];
    localPlayerId: string;
}

export class Client {
    roomName: string;
    localState: GameState;
    onTableSync: (newState: GameState) => void;
    socket: SocketIO.Socket;

    constructor(roomName: string, onTableSync: (newState: GameState) => void) {
        this.roomName = roomName;
        this.onTableSync = onTableSync; // mechanism for updating rendering state based on logical state
        const client = this;
        this.socket = io();
        this.socket.emit('JOIN', {roomName: roomName}, (id: string) => client.localState = {...client.localState, localPlayerId: id});
        this._bindClientEvents();

        this.localState = {
            players: [],
            sitRequests: [],
            hand: [],
            localPlayerId: undefined
        };
    }

    _bindClientEvents() {
        const socket = this.socket;
        const client = this;
        socket.on('TABLESYNC', (serverState) => {
            // Merge server and client state
            client.localState = {...client.localState, sitRequests: serverState.sitRequests, players: serverState.players};
            client.onTableSync(client.localState);
        });

        socket.on('SIT_REQUEST', (request) => {
            console.log('Recieved sit request.');
        });

        socket.on('SIT_ACCEPT', () => {
            console.log('You have been seated!');
        });

        socket.on('NEWHAND', (request) => {
            console.log(`You received your hand: ${request.hand}`);
            client.localState = {...client.localState, hand: request.hand};
            client.onTableSync(client.localState);
        });
    }

    sit(seat: number) {
        const socketId = this.socket.id;
        const roomName = this.roomName;
        this.socket.emit('SIT_REQUEST', {roomName, seat: seat, name: 'JoeTest', stack: 1000, socketId});
    }

    acceptSitRequest(sitRequest: SitRequest) {
        const roomName = this.roomName;
        this.localState.sitRequests = this.localState.sitRequests.filter(req => req.socketId != sitRequest.socketId);
        this.localState.players.push({name: sitRequest.name, stack: sitRequest.stack, seat: sitRequest.seat, socketId: sitRequest.socketId, status: 'PLAYING'});
        this.socket.emit('SIT_ACCEPT', sitRequest);
    }

    startGame() {
        this.socket.emit('DEAL_HAND', {roomName: this.roomName});
    }
}
