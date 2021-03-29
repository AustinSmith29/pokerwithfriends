export interface TextBoxInputStyle {
    width?: number;
    height?: number;
    internalPadding?: number;
}

const DEFAULT_STYLE: TextBoxInputStyle = {
    width: 400,
    height: 30,
    internalPadding: 5
};

export class TextBoxInput extends Phaser.GameObjects.GameObject {
    value: string;
    style: TextBoxInputStyle;
    private x: number;
    private y: number;
    private isFocused: boolean;
    private zone: Phaser.GameObjects.Zone;
    private textObject: Phaser.GameObjects.Text;
    private graphics: Phaser.GameObjects.Graphics;
    private mask: Phaser.Display.Masks.GeometryMask;
    private onSubmit: (value: string) => void;
    //private cursor:????;

    constructor(scene: Phaser.Scene, x: number, y: number, onSubmit: (value: string) => void, style: TextBoxInputStyle = DEFAULT_STYLE) {
        super(scene, 'TextBox');
        scene.add.existing(this);

        this.style = this.setStyle(style);
        this.x = x;
        this.y = y;
        this.onSubmit = onSubmit;

        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0x303030, 0.8);
        this.graphics.fillRect(this.x, this.y, this.style.width, this.style.height);
        this.mask = new Phaser.Display.Masks.GeometryMask(scene, this.graphics);

        this.value = '';
        this.textObject = scene.add.text(this.x + style.internalPadding, this.y + style.internalPadding, '');
        this.textObject.setMask(this.mask);
        this.isFocused = false;

        this.zone = scene.add.zone(x, y, this.style.width, this.style.height);
        this.zone.setInteractive();
        this.zone.on('pointerdown', this.setFocus);

        scene.input.keyboard.on('keydown', (keyboardEvent: any) => this.handleKeyDown(keyboardEvent));
    }

    _updateTextObject() {
        this.textObject.setText(this.value);
        // text scrolling
        if (this.textObject.x + this.textObject.width > this.x + this.style.width) {
            this.textObject.x -= (this.textObject.x + this.textObject.width) - (this.x + this.style.width);
        }
        // text backspace
        else if (this.textObject.width > this.style.width) {
            this.textObject.x += this.textObject.style.baselineX;
        }
        // regular typing without scrolling or submits
        else {
            this.textObject.x = this.x + this.style.internalPadding;
        }
    }

    handleKeyDown(keyboardEvent: any) { //TODO: Find out typing for HTML DOM KeyboardEvent
        if (true) {
            // TODO: Add proper unicode support (different languages etc.)
            const charCode = keyboardEvent.key.charCodeAt();
            // key gives name of key pressed. i.e "Shift" or "Alt." Regular keys like "a" and "!" are one character long.
            // Don't know if this works 100% but seems to be fine for a basic chat app.
            const isAscii = keyboardEvent.key.length === 1; 
            if (isAscii && keyboardEvent.key.charCodeAt() >= 32 && keyboardEvent.key.charCodeAt() <= 129) {
                this.value += keyboardEvent.key;
                this._updateTextObject();
            }
            else if (keyboardEvent.key === 'Backspace') {
                this.value = this.value.substring(0, this.value.length-1);
                this._updateTextObject();
            }
            else if (keyboardEvent.key === 'Enter') {
                this.submit();
            }
        }
    }

    submit() {
        this.onSubmit(this.value);
        this.value = '';
        this._updateTextObject();
    }

    setFocus() {
        this.isFocused = true;
    }

    setStyle(style: TextBoxInputStyle) {
        return DEFAULT_STYLE;
    }

}
