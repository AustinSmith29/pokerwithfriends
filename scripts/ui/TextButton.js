export class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, onClick) {
        super(scene, x, y, text);
        scene.add.existing(this);
        
        this.onClick = onClick;
        this.setInteractive({useHandCursor: true});
        this.on('pointerover', this.onHover);
        this.on('pointerout', this.reset);
        this.on('pointerdown', this.doClick);
        this.on('pointerup', this.reset);
    }

    doClick() {
        console.log('Click');
        this.setStyle({fill: '#0f0'});
        this.onClick();
    }

    onHover() {
        console.log('Hover');
        this.setStyle({fill: '#ff0'});
    }

    reset() {
        this.setStyle({fill: '#fff'});
    }

}
