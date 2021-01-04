import {Player, SitRequest} from '../server';

const io = require('socket.io-client');

export interface GameState {
    players: Player[];
    sitRequests: SitRequest[];
}

export class Client {
    roomName: string;
    localState: GameState;
    onTableSync: (newState: GameState) => void;
    socket: SocketIO.Socket;

    constructor(roomName: string, onTableSync: (newState: GameState) => void) {
        this.roomName = roomName;
        this.localState = {
            players: [],
            sitRequests: []
        };
        this.onTableSync = onTableSync; // mechanism for updating rendering state based on logical state
        this.socket = io();
        this.socket.emit('JOIN', {roomName: roomName});
        this._bindClientEvents();
    }

    _bindClientEvents() {
        const socket = this.socket;
        const client = this;
        socket.on('TABLESYNC', (serverState) => {
            client.localState = {...serverState};
            client.onTableSync(serverState);
        });

        socket.on('SIT_REQUEST', (request) => {
            console.log('Recieved sit request.');
        });

        socket.on('SIT_ACCEPT', () => {
            console.log('You have been seated!');
        });

        socket.on('NEWHAND', (request) => {
            console.log(`You received your hand: ${request.hand}`);
        });
    }

    sit(seat: number) {
        const socketId = this.socket.id;
        this.socket.emit('SIT_REQUEST', {roomName: this.roomName, seat: seat, name: 'JoeTest', stack: 1000, socketId});
    }

    acceptSitRequest(fromSocketId: string) {
        this.socket.emit('SIT_ACCEPT', {roomName: this.roomName, socketId: fromSocketId});
    }

    startGame() {
        this.socket.emit('DEAL_HAND', {roomName: this.roomName});
    }
}
