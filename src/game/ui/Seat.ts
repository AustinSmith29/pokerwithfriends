import {Button} from './button.js';
import {Modal} from './Modal.js';
import {Frame, Row, Column} from './Container.js';
import {StateObserver, Client, GameState} from '../client';
import {Player} from '../../server'; // TODO: EWWWW. Should be seperate. Or at least in an "intermediary" file

export enum SeatStatus {
    OPEN,
    RESERVED,
    PLAYING,
    STANDING
};

class PlayerSeat extends Modal {
    private depth: number;
    private rootFrame: Frame;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x-50, y-25, 100, 50, 100);
        this.rootFrame = new Frame(scene, 50, 100, x-50, y-25, 'column');
        this.refresh(player);
        this.depth = 100;
        this.rootFrame.depth = 100;
    }

    refresh(player: Player) {
        this.rootFrame.clear();
        this.rootFrame.pack(this.scene.add.text(0, 0, player.name), 20);
        this.rootFrame.pack(this.scene.add.text(0, 0, player.stack), 20);
    }
}

export class Seat extends Phaser.GameObjects.GameObject implements StateObserver {
    private static ID_COUNTER = 0;

    private x: number;
    private y: number;
    private id: number;
    private client: Client;
    private seatStatus: SeatStatus;
    private player: Player;
    private object: Phaser.GameObjects.GameObject;

    constructor(scene: Phaser.Scene, x: number, y: number, seatStatus: SeatStatus, client: Client) {
        super(scene, 'seat');
        this.object = undefined;
        this.x = x;
        this.y = y;
        this.client = client;
        this.setStatus(seatStatus);
        this.player = undefined;
        this.id = Seat.ID_COUNTER;
        Seat.ID_COUNTER++;

        this.client.addObserver(this);
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    onSit() {
        if (this.seatStatus === SeatStatus.OPEN) {
            this.setStatus(SeatStatus.RESERVED);
            this.client.sit(this.id);
        }
    }

    setStatus(newStatus: SeatStatus) {
        this.seatStatus = newStatus;
        if (this.object) {
            this.object.destroy();
        }
        switch(newStatus) {
            case SeatStatus.OPEN:
                this.object = new Button(this.scene, this.x, this.y, 'testButton', 'testButtonHover', 'testButtonClick', () => this.onSit());
                break;
            case SeatStatus.RESERVED:
                this.object = this.scene.add.text(this.x, this.y, 'Pending');
                break;
            default:
                this.object = new PlayerSeat(this.scene, this.x, this.y, this.player);
        }
    }

    onNotify(state: GameState) {
        const isSeatTaken = state.players.map(player => player.seat).includes(this.id);
        const isSeatRequested = state.sitRequests.map(request => request.seat).includes(this.id);
        if (isSeatTaken) {
            this.setPlayer(state.players.find(player => player.seat === this.id));
            this.setStatus(SeatStatus.PLAYING);
        }
        else if (isSeatRequested) {
            this.setStatus(SeatStatus.RESERVED);
        }
        else {
            this.setStatus(SeatStatus.OPEN);
        }
    }
}
