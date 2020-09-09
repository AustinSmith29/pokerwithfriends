const io = require('socket.io-client');

export class Client {
    constructor(roomName, onTableSync) {
        this.roomName = roomName;
        this.localState = {};
        this.onTableSync = onTableSync; // mechanism for updating rendering state based on logical state
        this.socket = io('/game');
        this.socket.emit('JOIN', {roomName: roomName});
        this._bindClientEvents();
    }

    _bindClientEvents() {
        const socket = this.socket;
        socket.on('TABLESYNC', (serverState) => {
            this.localState = {...serverState};
            this.onTableSync(serverState);
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

    sit(seat) {
        this.socket.emit('SIT_REQUEST', {roomName: this.roomName, seat: seat, name: 'JoeTest', stack: 1000, socketId: this.socket.id});
        this.status = 'PENDING';
    }

    acceptSitRequest(fromSocketId) {
        this.socket.emit('SIT_ACCEPT', {roomName: this.roomName, socketId: fromSocketId});
        this.status = 'PLAYING';
    }

    startGame() {
        this.socket.emit('DEAL_HAND', {roomName: this.roomName});
    }
}
