import {TextButton} from './TextButton';
import {Client} from '../client';

export class PlayerActionControls {
    private uiControls: {[name: string]: TextButton};
    private checkButton: TextButton;
    private foldButton: TextButton;
    private callButton: TextButton;
    private betButton: TextButton;
    private raiseButton: TextButton;
    private client: Client;
    private _visible: boolean;
    private _active: boolean;

    constructor(scene: Phaser.Scene, client: Client) {
        this.client = client;
        this.uiControls = {
            'check': new TextButton(scene, 500, 720, 'Check', () => client.endTurn({'action': 'check'})),
            'fold':  new TextButton(scene, 580, 720, 'Fold', () => client.endTurn({'action': 'fold'})),
            'call':  new TextButton(scene, 650, 720, 'Call', () => client.endTurn({'action': 'call'})),
            'bet':   new TextButton(scene, 740, 720, 'Bet', () => this.doBet()),
            'raise': new TextButton(scene, 790, 720, 'Raise', () => this.doRaise())
        };

    }

    doBet() {
        const amount = 50; // TODO: Get value from textbox or betting slider
        this.client.endTurn({'action': 'bet', amount});
    }

    doRaise() {
        //TODO: Implement
        throw Error('Not Implemented');
    }

    get visible() {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        Object.values(this.uiControls).forEach(control => control.visible = val);
    }

    get active() {
        return this._active;
    }

    set active(val: boolean) {
        this._active = val;
        Object.values(this.uiControls).forEach(control => control.active = val);
    }
}
