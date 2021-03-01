interface ModalStyle {
    borderThickness?: number;
    borderColor?: number;
    borderAlpha?: number;
    windowAlpha?: number;
    windowColor?: number;
    windowHeight?: number;
    padding?: number;
    closeButtonColor?: string;
    dialogSpeed?: number;
}

export class Modal extends Phaser.GameObjects.Graphics {
    private style: ModalStyle | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, depth=0, style: ModalStyle | undefined  = undefined) {
        super(scene);
        scene.add.existing(this);
        this.style = this._setStyle(style);
        this.depth = depth;

        /* We do NOT alter this.x or this.y because Phaser.GameObjects.Graphics drawing context uses that as the drawing origin.
         * Found this out the hard way... was trying to draw Modal at (300, 300) so I set this.x and this.y to 300 and called the
         * _createWindow method, but because I changed the origin it was drawing it at (600, 600). Checking the object properties
         * said the x, y were at 300 though... it's a deceptive name but now I know.
        */
        this._createWindow(x, y, w, h);
    }

    _setStyle(style: ModalStyle | undefined) {
        return {
            borderThickness: (style && style.borderThickness) || 3,
            borderColor: (style && style.borderColor) || 0x907748,
            borderAlpha: (style && style.borderAlpha) || 1,
            windowAlpha: (style && style.windowAlpha) || 0.8,
            windowColor: (style && style.windowColor) || 0x303030,
            windowHeight: (style && style.windowHeight) || 150,
            padding: (style && style.padding) || 32,
            closeButtonColor: (style && style.closeButtonColor) || 'darkgoldenrod',
            dialogSpeed: (style && style.dialogSpeed) || 3
        }
    }

    _createWindow(x: number, y: number, w: number, h: number) {
        // outer window
        this.lineStyle(this.style.borderThickness, this.style.borderColor, this.style.borderAlpha);
        this.strokeRect(x, y, w, h);

        // inner window
        this.fillStyle(this.style.windowColor, this.style.windowAlpha);
        this.fillRect(x + this.style.borderThickness, y + this.style.borderThickness, w - this.style.borderThickness, h - this.style.borderThickness);
    }

    destroy() {
        this.destroy();
    }
}
