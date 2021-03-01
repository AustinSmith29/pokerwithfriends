import * as Phaser from 'phaser';
import {Client, GameState} from './client';
import {PlayerManagementModal} from './ui/PlayerManagementModal';
import {TextButton} from './ui/TextButton.js';
import {Seat, SeatStatus} from './ui/Seat';
import {Modal} from './ui/Modal';
import {Frame, Row, Column} from './ui/Container.js';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Poker Game'
};

class PokerGame extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    game: Phaser.Game;
    origin: number[];
    coordinateBase: Coordinates;
    client: Client;
    seats: Seat[];
    playerManagementModal: PlayerManagementModal;
    playerManagementButton: TextButton;
    startPlayingButton: TextButton;

    init() {
        this.origin = [this.game.config.width as number / 2, this.game.config.height as number /2];
        //const scaleRatio = window.devicePixelRadio / 3;
        //this.coordinateBase = new Coordinates(origin, scaleRatio);
        this.coordinateBase = new Coordinates(this.origin, 3);
        this.seats = [];
    }

    preload() {
        //this.background = this.load.image('background', 'assets/pokerBackground.png');
        this.load.image('table', 'assets/pokertable.png');
        this.load.image('testButton', 'assets/testButton.png');
        this.load.image('testButtonHover', 'assets/testButtonHover.png');
        this.load.image('testButtonClick', 'assets/testButtonClick.png');
        this.load.image('card_back', 'assets/cards/card_back.svg');
        const suits = ['clubs', 'hearts', 'spades', 'diamonds'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 13; j++) {
                const filename = `assets/cards/${ranks[j]}_of_${suits[i]}.svg`;
                this.load.image(`${ranks[j]}_${suits[i]}`, filename);
            }
        }
    }

    create() {
        const roomName = new URLSearchParams(location.search).get('roomName');
        this.client = new Client(roomName);

        //this.add.image(this.origin[0], this.origin[1], 'table');
        //let card = this.add.image(400, 400, 'ace_spades');
        //card.setScale(0.40);
        for (let i = 0; i < 9; i++) {
            const [x, y] = this.coordinateBase.seatCoordinates(i);
            this.seats.push(new Seat(this.scene.scene, x, y, SeatStatus.OPEN, this.client));
        }

        this.playerManagementModal = new PlayerManagementModal(this.scene.scene, this.client);
        this.playerManagementButton = new TextButton(this.scene.scene, 20, 20, 'Players', () => this.playerManagementModal.show());
        this.startPlayingButton = new TextButton(this.scene.scene, 20, 80, 'Start Game', () => this.client.startGame());
    }

    update() {
    }
}

class Coordinates {

    constructor(tableCenter: number[], scaleRatio: number) {
        const [x, y] = tableCenter;
        this.originX = x;
        this.originY = y;
        this.scaleRatio = scaleRatio;
    }

    originX: number;
    originY: number;
    scaleRatio: number;

    localToWorld = (x: number, y: number) => [x + this.originX, y + this.originY];

    seatCoordinates = (seat: number) => {
        switch(seat) {
            case 0: 
                return this.localToWorld(30, 160);
            case 1:
                return this.localToWorld(280, 110);
            case 2:
                return this.localToWorld(350, -50);
            case 3:
                return this.localToWorld(280, -210);
            case 4:
                return this.localToWorld(30, -260);
            case 5:
                return this.localToWorld(-230, -260);
            case 6:
                return this.localToWorld(-485, -210);
            case 7:
                return this.localToWorld(-550, -50);
            case 8:
                return this.localToWorld(-485, 110);
            case 9:
                return this.localToWorld(-230, 160);
            default:
                throw "Unknown Seat Number";
        }
    }

    communityCardCoordinates = () => {
    }

}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
        //        width: window.innerWidth, 
        //height: window.innerHeight
    }, 
    scene: PokerGame
};

export const game = new Phaser.Game(config);
