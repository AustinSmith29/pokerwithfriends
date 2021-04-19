
export interface SliderInputStyle {
}

export class SliderInput extends Phaser.GameObjects.GameObject {
    minValue: number = 0;
    maxValue: number = 100;
    _value: number = 0;
    _visible: boolean = true;

    x: number;
    y: number;
    private normalizedValue: number;
    private width: number;
    private height: number;
    private sliderX: number;
    private sliderY: number;
    private bar: Phaser.GameObjects.Graphics;
    private slider: Phaser.GameObjects.Graphics;
    private sliderZone: Phaser.GameObjects.Zone;
    private onUpdate: (value: number) => void;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, onUpdate: (value: number) => void) {
        super(scene, 'SliderInput');
        scene.add.existing(this);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onUpdate = onUpdate;
        const minX = this.x;
        const maxX = this.x + width;
        const sliderX = this.x;
        const sliderY = this.y;

        const centerY = this.y + (height / 2)
        this.bar = scene.add.graphics();
        this.slider = scene.add.graphics();
        let slider = this.slider;
        this.bar.fillStyle(0x303030, 0.8);
        this.bar.fillRect(this.x, this.y + (height / 4), width, height / 2);
        slider.x = sliderX;
        slider.y = sliderY;
        slider.fillStyle(0x907748, 1);
        slider.fillRect(0, 0, 20, height);
        this.sliderZone = scene.add.zone(sliderX - 10, sliderY -10, 60, height + 20);
        this.sliderZone.setInteractive({useHandCursor: true});
        scene.input.setDraggable(this.sliderZone);
        const sliderRef = this;
        scene.input.on('drag', function (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Zone, dragX: number, dragY: number) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            slider.x = gameObject.x;
            if (slider.x < minX) {
                slider.x = minX;
            }
            if (slider.x > maxX) {
                slider.x = maxX;
            }
            // Calculate updated slider value
            const normalizedValue = (slider.x - minX) / (maxX - minX);
            let realValue = normalizedValue * sliderRef.maxValue;
            if (realValue < sliderRef.minValue) {
                realValue = sliderRef.minValue;
            }
            sliderRef.value = realValue;
            sliderRef.onUpdate(realValue);
        });
    }

    get value() {
        return this._value;
    }

    set value(val: number) {
        this._value = val;
    }

    get visible() {
        return this._visible;
    }

    set visible(val: boolean) {
        this.slider.visible = val;
        this.bar.visible = val;
        this._visible = val;
    }

    _calculateValueFromSliderPosition() {
        const normalizedValue = (this.slider.x - this.x) / (this.x + this.width - this.x);
        let realValue = normalizedValue * this.maxValue;
        if (realValue < this.minValue) {
            realValue = this.minValue;
        }
        this._value = realValue;
    }

    _calculateSliderPositionFromValue(value: number) {
        const normaliedValue = (value < this.minValue) ? this.minValue : (value - this.minValue / (this.maxValue)); // ???
    }
}
