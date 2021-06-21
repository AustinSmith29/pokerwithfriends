import {Player, SitRequest, GameState, PlayerAction} from '../shared/interfaces';

const io = require('socket.io-client');

export interface Observer<T> {
    onNotify: (thing: T) => void;
}

export interface Subject<T, Obs extends Observer<T>> {
    addObserver: (observer: Obs) => void;
    removeObserver: (observer: Obs) => void;
    notify: (thing: T) => void;
}

export enum EventType {
    TableSync,
    Chat
};

interface EventI<T extends EventType, D> {
    type: T;
    data: D;
}

export type Event = EventI<EventType.TableSync, GameState> | EventI<EventType.Chat, string>;

export type EventObserver = Observer<Event>;
export type EventSubject = Subject<Event, EventObserver>;
/*
export interface StateSubject {
    addObserver: (observer: StateObserver) => void;
    removeObserver: (observer: StateObserver) => void;
    notify: (state: GameState) => void;
}
 */

const names = [
    'Austin Da GOAT',
    'Xander Da Fool',
    'Felipe',
    'Dingus Khan'
];

export class Client implements EventSubject {
    private roomName: string;
    private localState: GameState;
    private eventObservers: EventObserver[];
    readonly socket: SocketIO.Socket;

    constructor(roomName: string) {
        this.roomName = roomName;
        this.socket = io();
        this.socket.emit('JOIN', { roomName }, (id: string) => console.log(`CLIENT JOINED WITH ID ${id}`));
        this._bindClientEvents();

        this.localState = {
            players: [],
            sitRequests: [],
            whoseTurn: undefined,
            board: [],
            dealer: undefined,
            smallBlind: undefined,
            bigBlind: undefined,
            bets: [],
            pots: []
        };

        this.eventObservers = [];
    }

    _bindClientEvents() {
        const socket = this.socket;
        const client = this;
        socket.on('TABLESYNC', (serverState) => {
            // Merge server and client state
            client.localState = serverState;
            client.notify({type: EventType.TableSync, data: client.localState});
        });

        socket.on('CHAT', (message) => {
            client.notify({type: EventType.Chat, data: message});
        });
    }


    addObserver(observer: EventObserver) {
        this.eventObservers.push(observer);
    }

    removeObserver(observer: EventObserver) {
        this.eventObservers = this.eventObservers.filter(obs => obs !== observer)
    }

    notify(event: Event) {
        this.eventObservers.forEach(observer => observer.onNotify(event));
    }

    sendChat(message: string) {
        this.socket.emit('CHAT', message);
    }

    endTurn(data: PlayerAction) {
        this.socket.emit('TURN_END', data);
    }

    sit(seat: number) {
        const socketId = this.socket.id;
        // TEMPORARY HACK FOR DEBUG PURPOSES
        const randomName = names[names.length * Math.random() | 0];
        this.socket.emit('SIT_REQUEST', {seat: seat, name: randomName, stack: 1000, socketId});
    }

    acceptSitRequest(sitRequest: SitRequest) {
        const roomName = this.roomName;
        this.localState.sitRequests = this.localState.sitRequests.filter(req => req.socketId != sitRequest.socketId);
        this.localState.players.push({name: sitRequest.name, stack: sitRequest.stack, hand: [], socketId: sitRequest.socketId, seat: sitRequest.seat, status: 'PLAYING'});
        this.socket.emit('SIT_ACCEPT', sitRequest);
    }

    startGame() {
        this.socket.emit('START_GAME', {roomName: this.roomName});
    }
}
