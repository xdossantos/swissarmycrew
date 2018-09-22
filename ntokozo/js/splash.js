import Phaser from 'phaser';

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'Slash' });
    }

    create() {
        this.text = this.add.text(0, 0, "Welcome to Inkumbulo!", { font: "40px Impact" });
        this.ENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if (this.ENTER.isDown) {
            this.scene.start('Game');
        }
    }
}