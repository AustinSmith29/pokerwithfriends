export class CardHolder extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene.scene);
        this.x = x;
        this.y = y;
        this.card1 = null;
        this.card2 = null;
    } 

    setHand(hand) {
        if (hand.length == 0) {
            this.card1 = null;
            this.card2 = null;
            return;
        }
        if (this.card1) {
            this.card1.destroy();
        }
        if (this.card2) {
            this.card2.destroy();
        }

        const [card1, card2] = hand;
        if (card1 == 'X' || card2 == 'X') {
            this.card1 = this.scene.add.image(this.x-20, this.y, 'card_back').setScale(0.40); 
            this.card2 = this.scene.add.image(this.x + 20, this.y, 'card_back').setScale(0.40);
        }
        else {
            //TODO: God awful ugly... but its 12:02 am and I just wanna see if this works so I can go to bed. Obviously we don't want to duplicate this code that is elsewhere
            // in the codebase. I just figure when I do my big refactor this will be changed so fuck it here it is.
            const suits = ['clubs', 'hearts', 'spades', 'diamonds'];
            const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
            const card1_asset = `${ranks[hand[0].rank]}_${suits[hand[0].suit]}`
            const card2_asset = `${ranks[hand[1].rank]}_${suits[hand[1].suit]}`
            this.card1 = this.scene.add.image(this.x-20, this.y, card1_asset).setScale(0.40);
            this.card2 = this.scene.add.image(this.x+20, this.y, card2_asset).setScale(0.40);
        }
    }
}
