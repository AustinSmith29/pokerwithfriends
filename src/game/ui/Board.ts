import { EventObserver, Event, EventType, Client } from '../client';

export class Board extends Phaser.GameObjects.GameObject implements EventObserver {

    private cards: Phaser.GameObjects.Image[];
    private client: Client;

    constructor(scene: Phaser.Scene, client: Client) {
        super(scene, 'Board');
        this.cards = [];
        this.client = client;
        this.client.addObserver(this);
    }

    onNotify(event: Event) {
        if (event.type === EventType.TableSync) {
            const state = event.data;
            let [x, y] = [300, 300];
            this.clear();
            for (const card of state.board) {
                this.cards.push(this.scene.add.image(x, y, card).setScale(0.40));
                x += 100;
            }
        }
    }

    clear() {
        this.cards.forEach(card => card.destroy());
        this.cards = [];
    }
}
