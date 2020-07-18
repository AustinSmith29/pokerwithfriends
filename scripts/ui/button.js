export class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, idleImg, hoverImg, clickImg, onClick) {
        if([idleImg, hoverImg, clickImg].filter(img => !scene.scene.textures.exists(img)).length > 0) {
            console.error('Images not loaded!');
        }
        super(scene.scene, x, y, idleImg);

        scene.scene.add.existing(this);

        this.idleImg = idleImg;
        this.hoverImg = hoverImg;
        this.clickImg = clickImg;
        this.onClick = onClick;
        
        this.setInteractive({useHandCursor: true});
        scene.scene.input.enableDebug(this);
        this.on('pointerover', this.onHover);
        this.on('pointerout', this.reset);
        this.on('pointerdown', this.doClick);
        this.on('pointerup', this.reset);
        
    }

    doClick() {
        console.log('Button clicked!');
        this.setTexture(this.clickImg);
        this.onClick();
    }

    onHover() {
        console.log('Hover event!');
        this.setTexture(this.hoverImg);
    }

    reset() {
        this.setTexture(this.idleImg);
    }
}
