import {Modal} from './Modal';
import {EventObserver, Event, EventType, Client} from '../client';
import { TextBoxInput } from './primitives/TextBoxInput';
import { TextButton } from './TextButton';

export class ChatBox extends Modal implements EventObserver {

    private static WIDTH: number = 500;
    private static HEIGHT: number = 150;

    private textObject: Phaser.GameObjects.Text;
    private messages: string[];
    private client: Client;
    private chatBoxX: number;
    private chatBoxY: number;
    mask: Phaser.Display.Masks.GeometryMask;
    textBox: TextBoxInput;
    sendButton: TextButton;

    constructor(scene: Phaser.Scene, client: Client) {
        super(scene, 20, 750, ChatBox.WIDTH, ChatBox.HEIGHT);
        this.messages = [];
        this.textObject = scene.add.text(26, 750, '');
        this.textObject.setWordWrapWidth(ChatBox.WIDTH);
        this.textObject.setText(this.messages);
        this.client = client;
        this.mask = new Phaser.Display.Masks.GeometryMask(scene, this);
        this.client.addObserver(this);
        this.textObject.setMask(this.mask);
        this.chatBoxX = 20;
        this.chatBoxY = 750;
        this.textBox = new TextBoxInput(scene, 20, 910, (message: string) => this.client.sendChat(message));
        this.sendButton = new TextButton(scene, 450, 915, 'Send', () => this.textBox.submit())
    }

    addMessage(msg: string) {
        this.messages.push(msg);
        this.textObject.setText(this.messages);
        if (this.textObject.y + this.textObject.height > this.y + ChatBox.HEIGHT) {
            this.textObject.y -= (this.textObject.y + this.textObject.height) - (this.chatBoxY + ChatBox.HEIGHT);
        }
    } 
    onNotify(event: Event) {
        if (event.type === EventType.Chat) {
            this.addMessage(event.data);
        }
    }
}
