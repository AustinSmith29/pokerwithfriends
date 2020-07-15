import {Client} from './client.js';

function onTableSync(gameObj) {
    return function() {
        console.log(gameObj);
    }
}

class PokerGame {
    constructor() {
        const width = window.innerWidth * window.devicePixelRatio;
        const height = window.innerHeight * window.devicePixelRatio;
        const scaleRatio = window.devicePixelRadio / 3;
        const config = {
            type: Phaser.AUTO,
            scale: {
                parent: 'game',
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: width, 
                height: height
            }, 
            scene: {
                init: this.init,
                preload: this.preload,
                create: this.create,
                update: this.update
            },
        };
        this.game = new Phaser.Game(config);
    }

    init() {
        const origin = [this.game.config.width/2, this.game.config.height/2];
        //const scaleRatio = window.devicePixelRadio / 3;
        //this.coordinateBase = new Coordinates(origin, scaleRatio);
        this.coordinateBase = new Coordinates(origin, 3);
        this.onTableSync = onTableSync(this);
    }

    preload() {
        this.background = this.load.image('background', 'assets/pokerBackground.png');
        this.table = this.load.image('table', 'assets/pokertable.png');
    }

    create() {
        const roomName = new URLSearchParams(location.search).get('roomName');
        this.client = new Client(roomName, this.onStateUpdate);

        var graphics = this.add.graphics();
        graphics.fillStyle(0xffff00, 1);
        const [centerX, centerY] = [this.game.config.width / 2, this.game.config.height / 2];
        this.add.image(centerX, centerY, 'table');
        this.table.scale.setTo(this.scaleRatio, this.scaleRatio);
    }

    update() {
    }
}

class Coordinates {

    constructor(tableCenter, scaleRatio) {
        const [x, y] = tableCenter;
        this.originX = x;
        this.originY = y;
        this.scaleRatio = scaleRatio;
    }

    localToWorld = (x, y) => [x + this.originX, y + this.originY];

    seatCoordinates = (seat) => {
        switch(seat) {
            case 0: 
                return this.localToWorld(30, 160);
            case 1:
                return this.localToWorld(280, 110);
            case 2:
                return this.localToWorld(350, -50);
            case 3:
                return this.localToWorld(280, -210);
            case 4:
                return this.localToWorld(30, -260);
            case 5:
                return this.localToWorld(-230, -260);
            case 6:
                return this.localToWorld(-485, -210);
            case 7:
                return this.localToWorld(-550, -50);
            case 8:
                return this.localToWorld(-485, 110);
            case 9:
                return this.localToWorld(-230, 160);
            default:
                throw "Unknown Seat Number";
        }
    }

    communityCardCoordinates = () => {
    }

}

window.onload = () => {
    var game = new PokerGame();
};
