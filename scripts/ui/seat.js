import {Button} from './button.js'

export const SeatStatus = Object.freeze( {
    'OPEN': 1,
    'RESERVED': 2,
    'PLAYING': 3,
    'STANDING': 4
});

export class Seat extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, seatStatus, onSit) {
        super(scene.scene, 'seat');
        this.object = undefined;
        this.x = x;
        this.y = y;
        this.onSit = onSit;
        this.seatStatus = seatStatus;
        this.setStatus(seatStatus);
    }

    setStatus(newStatus) {
        this.seatStatus = newStatus;
        if (this.object) {
            this.object.destroy();
        }
        switch(newStatus) {
            case SeatStatus.OPEN:
                this.object = new Button(this.scene, this.x, this.y, 'testButton', 'testButtonHover', 'testButtonClick', () => {this.setStatus(SeatStatus.PLAYING); this.onSit();});
                break;
            default:
                this.object = this.scene.add.text(this.x, this.y, 'Playing');
        }
    }
}
