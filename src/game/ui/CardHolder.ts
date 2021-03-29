import {EventObserver, EventType, Event, Client, GameState} from '../client';

interface Card {
    rank: number;
    suit: number;
}

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

    setHand(hand: Card[]) {
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
}
