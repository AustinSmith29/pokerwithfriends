export class TextButton extends Phaser.GameObjects.Text {
    private onClick: () => void;
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick: () => void, style?: object) {
        super(scene, x, y, text, style);
        scene.add.existing(this);
        
        this.onClick = onClick;
        this.setInteractive({useHandCursor: true});
        this.on('pointerover', this.onHover);
        this.on('pointerout', this.reset);
        this.on('pointerdown', this.doClick);
        this.on('pointerup', this.reset);
    }

    doClick() {
        this.setStyle({fill: '#0f0'});
        this.onClick();
    }

    onHover() {
        this.setStyle({fill: '#ff0'});
    }

    reset() {
        this.setStyle({fill: '#fff'});
    }

}
