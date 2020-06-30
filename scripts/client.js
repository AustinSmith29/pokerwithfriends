export class Client {
    constructor(socket, roomName) {
        this.socket = socket;
        this.roomName = roomName;
        this.status = 'LOBBY';
        this.gameState = this.getState();
    }

    getState() {
        const socket = this.socket;
        socket.on('TABLESYNC', function(gameState) {
            this.gameState = {...gameState};
        });

        socket.on('SIT_REQUEST', function(request) {
            console.log('Recieved sit request.');
        });

        socket.on('SIT_ACCEPT', function() {
            this.status = 'SEATED'
        });

        return this.gameState;
    }

    sit(seat) {
        this.socket.emit('SIT', {roomName: this.roomName, seat: seat});
        this.status = 'PENDING';
    }

}
