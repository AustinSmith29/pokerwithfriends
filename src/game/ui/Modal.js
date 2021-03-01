export class Modal extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, w, h, depth=0, style=undefined) {
        super(scene, "Modal");
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = w;
        this.style = this._setStyle(style);
        this.graphics = scene.add.graphics();
        this.graphics.depth = depth;

        this._createWindow(x, y, w, h);
    }

    _setStyle(style) {
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

    _createWindow(x, y, w, h) {
        // outer window
        this.graphics.lineStyle(this.style.borderThickness, this.style.borderColor, this.style.borderAlpha);
        this.graphics.strokeRect(x, y, w, h);

        // inner window
        this.graphics.fillStyle(this.style.windowColor, this.style.windowAlpha);
        this.graphics.fillRect(x + this.style.borderThickness, y + this.style.borderThickness, w - this.style.borderThickness, h - this.style.borderThickness);
    }

    destroy() {
        this.graphics.destroy();
        super.destroy();
    }
}
