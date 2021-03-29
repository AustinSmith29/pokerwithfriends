import {Button} from './button.js';
import {TextButton} from './TextButton';
import {Modal} from './Modal';
import {Frame, Row, Column} from './Container.js';
import {EventObserver, Event, EventType, Client} from '../client';
import {Player} from '../../server'; // TODO: EWWWW. Should be seperate. Or at least in an "intermediary" file
import {PlayerActionControls} from './PlayerAction';

export enum SeatStatus {
    OPEN,
    RESERVED,
    PLAYING,
    STANDING
};

interface Card {
    rank: number;
    suit: number;
}

class CardHolder {
    private x: number;
    private y: number;
    private card1_image: Phaser.GameObjects.Image | null;
    private card2_image: Phaser.GameObjects.Image;
    private scene: Phaser.Scene;
    private _visible: boolean;
    private _active: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.card1_image = null;
        this.card2_image = null;
    } 

    setHand(hand: Card[]) {
        //TODO: Change card types from Images to Sprites so we aren't constantly creating and deleting...
        //      we can just call setTexture.
        if (!hand || hand.length == 0) {
            this.card1_image = null;
            this.card2_image = null;
            return;
        }
        if (this.card1_image) {
            this.card1_image.destroy();
        }
        if (this.card2_image) {
            this.card2_image.destroy();
        }

        const [card1, card2] = hand;
        if (card1.rank < 0 || card2.rank < 0) {
            this.card1_image = this.scene.add.image(this.x-20, this.y, 'card_back').setScale(0.40); 
            this.card2_image = this.scene.add.image(this.x + 20, this.y, 'card_back').setScale(0.40);
        }
        else {
            //TODO: God awful ugly... but its 12:02 am and I just wanna see if this works so I can go to bed. Obviously we don't want to duplicate this code that is elsewhere
            // in the codebase. I just figure when I do my big refactor this will be changed so fuck it here it is.
            const suits = ['clubs', 'hearts', 'spades', 'diamonds'];
            const ranks = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
            const card1_asset = `${ranks[card1.rank]}_${suits[card1.suit]}`
            const card2_asset = `${ranks[card2.rank]}_${suits[card2.suit]}`
            this.card1_image = this.scene.add.image(this.x-20, this.y, card1_asset).setScale(0.40);
            this.card2_image = this.scene.add.image(this.x+20, this.y, card2_asset).setScale(0.40);
        }
    }

    get visible() {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        this.card1_image.visible = val;
        this.card2_image.visible = val;
    }

    get active() {
        return this._active;
    }

    set active(val: boolean) {
        this._active = val;
        this.card1_image.active = val;
        this.card2_image.active = val;
    }
}

class PlayerInfo {
    private infoFrame: Frame;
    private modal: Modal;
    private scene: Phaser.Scene;
    private _visible: boolean;
    private _active: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.modal = new Modal(scene, x, y, 100, 50, 99);
        this.infoFrame = new Frame(scene, 50, 100, x, y, 'column');
        this.infoFrame.depth = 100;
        this._visible = true;
        this._active = true;
    }

    display(player: Player) {
        this.visible = true;
        this.infoFrame.clear();
        this.infoFrame.pack(this.scene.add.text(0, 0, player.name), 20);
        this.infoFrame.pack(this.scene.add.text(0, 0, player.stack.toString()), 20);
    }

    get visible() {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        this.infoFrame.visible = val;
        this.modal.visible = val;
    }

    get active() {
        return this._active;
    }

    set active(val: boolean) {
        this._active = val;
        this.infoFrame.active = val;
        this.modal.active = val;
    }
}

export class Seat extends Phaser.GameObjects.GameObject implements EventObserver {
    private static ID_COUNTER = 0;

    private x: number;
    private y: number;
    private id: number;
    private client: Client;
    private seatStatus: SeatStatus;
    private playerInfo: PlayerInfo;
    private sitButton: Button;
    private playerCards: CardHolder; // TODO: Change name of CardHolder... don't like it.
    private playerActionControls: PlayerActionControls;
    private reservedText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, seatStatus: SeatStatus, client: Client) {
        super(scene, 'seat');
        this.id = Seat.ID_COUNTER;
        Seat.ID_COUNTER++;

        this.x = x;
        this.y = y;
        this.client = client;

        this.playerInfo = new PlayerInfo(this.scene, this.x, this.y);
        this.sitButton = new Button(this.scene, this.x, this.y, 'testButton', 'testButtonHover', 'testButtonClick', () => this.onSit());
        this.reservedText = this.scene.add.text(this.x, this.y, 'Pending');
        this.playerCards = new CardHolder(this.scene, this.x, this.y);
        this.playerActionControls = new PlayerActionControls(this.scene, client);
        this.playerActionControls.visible = false;
        this.playerActionControls.active = false;

        this.setStatus(seatStatus);
        this.client.addObserver(this);
    }

    onSit() {
        if (this.seatStatus === SeatStatus.OPEN) {
            this.setStatus(SeatStatus.RESERVED);
            this.client.sit(this.id);
        }
    }

    setStatus(newStatus: SeatStatus) {
        this.seatStatus = newStatus;

        const activate = (obj: {visible: boolean, active: boolean}) => {
            obj.visible = true;
            obj.active = true;
        };

        const deactivate = (obj: {visible: boolean, active: boolean}) => {
            obj.visible = false;
            obj.active = false;
        };

        switch(newStatus) {
            case SeatStatus.OPEN:
                activate(this.sitButton);
                deactivate(this.playerInfo);
                deactivate(this.reservedText);
                break;
            case SeatStatus.RESERVED:
                activate(this.reservedText);
                deactivate(this.playerInfo);
                deactivate(this.sitButton);
                break;
            case SeatStatus.PLAYING:
                activate(this.playerInfo);
                deactivate(this.sitButton);
                deactivate(this.reservedText);
        }
    }

    onNotify(event: Event) {
        if (event.type === EventType.TableSync) {
            const state = event.data;
            const isSeatTaken = state.players.map(player => player.seat).includes(this.id);
            const isSeatRequested = state.sitRequests.map(request => request.seat).includes(this.id);
            const isMyTurn = (this.client.socket.id === state.whoseTurn?.socketId);
            if (isSeatTaken) {
                const player = state.players.find(player => player.seat === this.id);
                this.playerInfo.display(player);
                this.playerCards.setHand(player.hand);
                this.setStatus(SeatStatus.PLAYING);
                if (isMyTurn) {
                    this.playerActionControls.visible = true;
                    this.playerActionControls.active = true;
                }
                else {
                    this.playerActionControls.visible = false;
                    this.playerActionControls.active = false;
                }
            }
            else if (isSeatRequested) {
                this.setStatus(SeatStatus.RESERVED);
            }
            else {
                this.setStatus(SeatStatus.OPEN);
            }
        }
    }
}
