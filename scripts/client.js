export class Client {
    constructor(roomName, onStateUpdateFunc) {
        this.roomName = roomName;
        this.localState = {};
        this.onStateUpdateFunc = onStateUpdateFunc; // mechanism for updating rendering state based on logical state
        this.socket = io('/game');
        this.socket.emit('JOIN', {roomName: roomName});
        this._bindClientEvents();
    }

    _bindClientEvents() {
        const socket = this.socket;
        socket.on('TABLESYNC', (serverState) => {
            this.localState = {...serverState};
            this.onStateUpdateFunc(serverState);
        });

        socket.on('SIT_REQUEST', (request) => {
            console.log('Recieved sit request.');
        });

        socket.on('SIT_ACCEPT', () => {
            console.log('You have been seated!');
        });
    }

    sit(seat) {
        this.socket.emit('SIT', {roomName: this.roomName, seat: seat});
        this.status = 'PENDING';
    }

}
