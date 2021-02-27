import {Player, SitRequest} from '../server';

const io = require('socket.io-client');

export interface GameState {
    players: Player[];
    sitRequests: SitRequest[];
    hand: [];
    localPlayerId: string;
}

export interface StateObserver {
    onNotify: (state: GameState) => void;
}

export interface StateSubject {
    addObserver: (observer: StateObserver) => void;
    removeObserver: (observer: StateObserver) => void;
    notify: (state: GameState) => void;
}

export class Client implements StateSubject {
    private roomName: string;
    private localState: GameState;
    private stateObservers: StateObserver[];
    private socket: SocketIO.Socket;

    constructor(roomName: string) {
        this.roomName = roomName;
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

        this.stateObservers = [];
    }

    _bindClientEvents() {
        const socket = this.socket;
        const client = this;
        socket.on('TABLESYNC', (serverState) => {
            // Merge server and client state
            client.localState = {...client.localState, sitRequests: serverState.sitRequests, players: serverState.players};
            client.notify(client.localState);
        });

        socket.on('SIT_REQUEST', (request) => {
            console.log('Recieved sit request.');
        });

        socket.on('SIT_ACCEPT', () => {
            console.log('You have been seated!');
        });
    }

    addObserver(observer: StateObserver) {
        this.stateObservers.push(observer);
    }

    removeObserver(observer: StateObserver) {
        this.stateObservers = this.stateObservers.filter(obs => obs !== observer)
    }

    notify(state: GameState) {
        this.stateObservers.forEach(observer => observer.onNotify(state));
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
