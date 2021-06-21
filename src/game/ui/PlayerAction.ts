import { TextButton } from './TextButton';
import { SliderInput } from './primitives/SliderInput';
import { Client } from '../client';

export class PlayerActionControls {
    private uiControls: {[name: string]: TextButton | SliderInput };
    private checkButton: TextButton;
    private foldButton: TextButton;
    private callButton: TextButton;
    private betButton: TextButton;
    private raiseButton: TextButton;
    private betSlider: SliderInput;
    private client: Client;
    private _visible: boolean;
    private _active: boolean;
    private wagerAmount: number;

    constructor(scene: Phaser.Scene, client: Client) {
        this.client = client;
        this.uiControls = {
            'check': new TextButton(scene, 500, 720, 'Check', () => client.endTurn({'type': 'CHECK'})),
            'fold':  new TextButton(scene, 580, 720, 'Fold', () => client.endTurn({'type': 'FOLD'})),
            'call':  new TextButton(scene, 650, 720, 'Call', () => client.endTurn({'type': 'CALL'})),
            'bet':   new TextButton(scene, 740, 720, 'Bet', () => this.doBet()),
            'raise': new TextButton(scene, 790, 720, 'Raise', () => this.doRaise()),
            'betSlider': new SliderInput(scene, 500, 650, 200, 75, (val: number) => this.setBet(val))
        };
        this.visible = false;
        this.wagerAmount = 0;
    }

    setBet(val: number) {
        this.wagerAmount = val;
    }

    doBet() {
        this.client.endTurn({'type': 'BET', 'amount': this.wagerAmount});
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
