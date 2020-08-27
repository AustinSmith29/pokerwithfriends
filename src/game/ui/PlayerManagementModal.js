import {Modal} from './Modal.js';
import {Frame, Row, Column} from './Container.js';
import {TextButton} from './TextButton.js';

export class PlayerManagementModal extends Modal {
    constructor(scene, client) {
        super(scene, 20, 20, 500, 400);
        this.rootFrame = new Frame(scene, 500, 400, 20, 20, 'column');
        this._buildPlayerRows(client);
    }

    _buildPlayerRows(client) {
        const modal = this;
        const headerRow = Row(this.rootFrame, 40);
        headerRow.pack(new TextButton(this.scene, 0, 0, "Close", () => modal.destroy()), 400);
        this.rootFrame.pack(headerRow);
        for (const request of client.localState.sitRequests) {
            const row = Row(this.rootFrame, 40);
            row.pack(this.scene.add.text(0, 0, request.name), 20);
            row.pack(this.scene.add.text(0, 0, request.stack), 20);
            row.pack(new TextButton(this.scene, 0, 0, "Accept", () => client.acceptSitRequest(request.socketId)), 20);
            this.rootFrame.pack(row);
        }

        for (const player of client.localState.players) {
            const row = Row(this.rootFrame, 40);
            row.pack(this.scene.add.text(0, 0, player.name), 20);
            row.pack(this.scene.add.text(0, 0, player.stack), 20);
            row.pack(new TextButton(this.scene, 0, 0, "Kick", () => console.log('Kicked Player')), 20);
            this.rootFrame.pack(row);
        }
    }

    destroy() {
        this.rootFrame.destroy();
        super.destroy();
    }
}
