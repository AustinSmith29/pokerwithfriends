import {Modal} from './Modal';
import {Frame, Row, Column} from './Container.js';
import {TextButton} from './TextButton';
import {EventObserver, EventType, Event, Client, GameState} from '../client';

const RENDER_DEPTH = 1000;

export class PlayerManagementModal extends Modal implements EventObserver{
    private client: Client;
    private rootFrame: Frame;

    constructor(scene: Phaser.Scene, client: Client) {
        super(scene, 20, 20, 500, 400, RENDER_DEPTH);
        this.rootFrame = new Frame(scene, 500, 400, 20, 20, 'column');
        this.rootFrame.depth = RENDER_DEPTH;
        this.client = client;
        this.hide();

        this.client.addObserver(this);
    }

    show() {
        this.rootFrame.visible = true;
        this.visible = true;
    }

    hide() {
        this.rootFrame.visible = false;
        this.visible = false;
    }

    onNotify(event: Event) {
        if (event.type === EventType.TableSync) {
            this.rootFrame.clear();
            this._buildPlayerRows(event.data);
        }
    }

    _buildPlayerRows(state: GameState) {
        const modal = this;
        const headerRow = Row(this.rootFrame, 40);
        headerRow.pack(new TextButton(this.scene, 0, 0, "Close", () => this.hide()), 400);
        this.rootFrame.pack(headerRow);
        for (const request of state.sitRequests) {
            const row = Row(this.rootFrame, 40);
            row.pack(this.scene.add.text(0, 0, request.name), 20);
            row.pack(this.scene.add.text(0, 0, request.stack.toString()), 20);
            row.pack(new TextButton(this.scene, 0, 0, "Accept", () => this.client.acceptSitRequest(request)), 20);
            this.rootFrame.pack(row);
        }

        for (const player of state.players) {
            const row = Row(this.rootFrame, 40);
            row.pack(this.scene.add.text(0, 0, player.name), 20);
            row.pack(this.scene.add.text(0, 0, player.stack.toString()), 20);
            row.pack(new TextButton(this.scene, 0, 0, "Kick", () => console.log('Kicked Player')), 20);
            this.rootFrame.pack(row);
        }
    }

    destroy() {
        this.rootFrame.destroy();
        super.destroy();
    }
}
