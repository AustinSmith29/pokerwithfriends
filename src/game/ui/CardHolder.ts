import { EventObserver, EventType, Event, Client } from '../client';

export class CardHolder extends Phaser.GameObjects.Container implements EventObserver {
    private static ID_COUNTER = 0;

    private card1_image: Phaser.GameObjects.Image | null;
    private card2_image: Phaser.GameObjects.Image;
    private id: number;
    private client: Client;

    constructor(scene: Phaser.Scene, x: number, y: number, client: Client) {
        super(scene);
        this.x = x;
        this.y = y;
        this.client = client;
        this.card1_image = null;
        this.card2_image = null;
        this.id = CardHolder.ID_COUNTER;
        CardHolder.ID_COUNTER++;

        this.client.addObserver(this);
    } 

    onNotify(event: Event) {
        if (event.type === EventType.TableSync) {
            const player = event.data.players.find(player => player.seat === this.id);
            if (player && player.status === 'PLAYING') {
                this.setHand(player.hand);
            }
        }
    }

    setHand(hand: string[]) {
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
        if (card1 === 'X' || card2 === 'X') {
            this.card1_image = this.scene.add.image(this.x-20, this.y, 'card_back').setScale(0.40); 
            this.card2_image = this.scene.add.image(this.x + 20, this.y, 'card_back').setScale(0.40);
        }
        else {
            this.card1_image = this.scene.add.image(this.x-20, this.y, card1).setScale(0.40);
            this.card2_image = this.scene.add.image(this.x+20, this.y, card2).setScale(0.40);
        }
    }
}
