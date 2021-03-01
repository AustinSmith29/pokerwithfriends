import {Button} from './button.js';
import {Modal} from './Modal.js';
import {Frame, Row, Column} from './Container.js';

export const SeatStatus = Object.freeze( {
    'OPEN': 1,
    'RESERVED': 2,
    'PLAYING': 3,
    'STANDING': 4
});

class PlayerSeat extends Modal {
    constructor(scene, x, y, player) {
        super(scene, x-50, y-25, 100, 50, 100);
        this.rootFrame = new Frame(scene, 50, 100, x-50, y-25, 'column');
        this.refresh(player);
        this.depth = 100;
        this.rootFrame.depth = 100;
    }

    refresh(player) {
        this.rootFrame.clear();
        this.rootFrame.pack(this.scene.add.text(0, 0, player.name), 20);
        this.rootFrame.pack(this.scene.add.text(0, 0, player.stack), 20);
    }
}

export class Seat extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, seatStatus, onSit) {
        super(scene.scene, 'seat');
        this.object = undefined;
        this.x = x;
        this.y = y;
        this.onSit = onSit;
        this.seatStatus = seatStatus;
        this.setStatus(seatStatus);
        this.player = undefined;
    }

    setPlayer(player) {
        this.player = player;
    }

    setStatus(newStatus) {
        this.seatStatus = newStatus;
        if (this.object) {
            this.object.destroy();
        }
        switch(newStatus) {
            case SeatStatus.OPEN:
                this.object = new Button(this.scene, this.x, this.y, 'testButton', 'testButtonHover', 'testButtonClick', () => {this.setStatus(SeatStatus.RESERVED); this.onSit();});
                break;
            case SeatStatus.RESERVED:
                this.object = this.scene.add.text(this.x, this.y, 'Pending');
                break;
            default:
                this.object = new PlayerSeat(this.scene, this.x, this.y, this.player);
        }
    }
}
