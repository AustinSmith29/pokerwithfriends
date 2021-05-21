import {Player, SitRequest} from '../server';

const io = require('socket.io-client');

export interface GameState {
    players: Player[];
    sitRequests: SitRequest[];
    localPlayerId: string;
    whoseTurn?: Player;
    board: {rank: number, suit: number}[];
    dealerPosition: number;
}

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

export interface EndTurnMessage {
    action: string;
    amount?: number;
}

export class Client implements EventSubject {
    private roomName: string;
    private localState: GameState;
    private eventObservers: EventObserver[];
    readonly socket: SocketIO.Socket;

    constructor(roomName: string) {
        this.roomName = roomName;
        const client = this;
        this.socket = io();
        this.socket.emit('JOIN', {roomName: roomName}, (id: string) => client.localState = {...client.localState, localPlayerId: id});
        this._bindClientEvents();

        this.localState = {
            players: [],
            sitRequests: [],
            localPlayerId: undefined,
            board: [],
            dealerPosition: 0,
        };

        this.eventObservers = [];
    }

    _bindClientEvents() {
        const socket = this.socket;
        const client = this;
        socket.on('TABLESYNC', (serverState) => {
            // Merge server and client state
            client.localState = {
                ...client.localState,
                sitRequests: serverState.sitRequests, 
                players: serverState.players, 
                whoseTurn: serverState?.whoseTurn, 
                board: serverState?.board,
                dealerPosition: serverState?.dealerPosition,
            };
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

    endTurn(data: EndTurnMessage) {
        this.socket.emit('TURN_END', data);
    }

    sit(seat: number) {
        const socketId = this.socket.id;
        this.socket.emit('SIT_REQUEST', {seat: seat, name: 'JoeTest', stack: 1000, socketId});
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
