export class Frame extends Phaser.GameObjects.Container {
    constructor(scene, w, h, xOffset=0, yOffset=0, expand='row') {
        super(scene);
        scene.add.existing(this);
        this.x = xOffset;
        this.y = yOffset;
        this.width = w;
        this.height = h;
        this.expand = expand;
        this.nextElementX = 0;
        this.nextElementY = 0;
    }

    pack(gameObj, padWidth=0, padHeight=0) {
        if (!('x' in gameObj) || !('y' in gameObj) || !('width' in gameObj) || !('height' in gameObj)) {
            throw "Game Object being packed must have properties: x, y, width, height.";
        }
        this.add(gameObj);
        switch(this.expand) {
            case 'row': 
                gameObj.x = this.nextElementX + padWidth;
                gameObj.y = this.nextElementY + padHeight;
                this.nextElementX += gameObj.width + padWidth;
                break; 
            case 'column': 
                gameObj.x = this.nextElementX + padWidth;
                gameObj.y = this.nextElementY + padHeight;
                this.nextElementY += gameObj.height + padHeight;
                break; 
            default:
                throw "Invalid expansion type. Must be 'row' or 'column'.";
        }
    }

    unpack() {
    }
};

export function Column(parentFrame, width, xOffset=0, yOffset=0) {
    return new Frame(parentFrame.scene, width, parentFrame.height, xOffset, yOffset, 'column');
}

export function Row(parentFrame, height, xOffset=0, yOffset=0) {
    return new Frame(parentFrame.scene, parentFrame.width, height, xOffset, yOffset, 'row');
}
