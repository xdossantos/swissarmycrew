import Phaser from 'phaser';
import splash from '../assets/splash.png'

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'Splash' });
    }

    preload() {
        this.load.image('splash', splash );

    }


    create() {
        this.add.image(400, 300, 'splash');
     
        this.ENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if (this.ENTER.isDown) {
            this.scene.start('Game');
        }
    }
}