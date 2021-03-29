export interface TextBoxStyle {
    width?: number;
    height?: number;
}

const DEFAULT_STYLE: TextBoxStyle = {
    width: 400,
    height: 40
};
export class TextBox extends Phaser.GameObjects.GameObject {
    value: string;
    style: TextBoxStyle;
    private x: number;
    private y: number;
    private isFocused: boolean;
    private zone: Phaser.GameObjects.Zone;
    private textObject: Phaser.GameObjects.Text;
    private graphics: Phaser.GameObjects.Graphics;
    private onSubmit: (value: string) => void;
    //private cursor:????;

    constructor(scene: Phaser.Scene, x: number, y: number, onSubmit: (value: string) => void, style: TextBoxStyle = DEFAULT_STYLE) {
        super(scene, 'TextBox');
        scene.add.existing(this);

        this.style = this.setStyle(style);
        this.x = x;
        this.y = y;
        this.onSubmit = onSubmit;

        this.graphics = scene.add.graphics();
        this.graphics.strokeRect(this.x, this.y, this.style.width, this.style.height);
        this.graphics.fillStyle(0x303030, 0.8);

        this.value = '';
        this.textObject = scene.add.text(this.x, this.y, '');
        this.isFocused = false;

        this.zone = scene.add.zone(x, y, this.style.width, this.style.height);
        this.zone.setInteractive();
        this.zone.on('pointerdown', this.setFocus);

        scene.input.keyboard.on('keydown', (keyboardEvent: any) => this.handleKeyDown(keyboardEvent));
    }

    handleKeyDown(keyboardEvent: any) { //TODO: Find out typing for HTML DOM KeyboardEvent
        // TODO: Add proper unicode support (different languages etc.)
        const charCode = keyboardEvent.key.charCodeAt();
        // key gives name of key pressed. i.e "Shift" or "Alt." Regular keys like "a" and "!" are one character long.
        // Don't know if this works 100% but seems to be fine for a basic chat app.
        const isAscii = keyboardEvent.key.length === 1; 
        if (isAscii && keyboardEvent.key.charCodeAt() >= 32 && keyboardEvent.key.charCodeAt() <= 129) {
            this.value += keyboardEvent.key;
            this.textObject.setText(this.value);
        }
        else if (keyboardEvent.key === 'Backspace') {
            this.value = this.value.substring(0, this.value.length-1);
            this.textObject.setText(this.value);
        }
        else if (keyboardEvent.key === 'Enter') {
            this.submit();
        }
    }

    submit() {
        this.onSubmit(this.value);
        this.value = '';
        this.textObject.setText(this.value);
    }

    setFocus() {
        this.isFocused = true;
    }

    setStyle(style: TextBoxStyle) {
        return DEFAULT_STYLE;
    }

}
