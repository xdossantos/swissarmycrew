import Phaser from 'phaser';
import splash from '../assets/splash.png';
import intromusic from '../assets/sound/intro.mp3';

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'Splash' });
    }

    preload() {
        // Preloader animation TODO develop and add animation 
        this.load.image('splash', splash );
        this.load.audio('intromusic', intromusic);

    }


    create() {
        this.add.image(1200, 600, 'splash');
        let introductionmusic = this.sound.add('intromusic')
        introductionmusic.play(); 
        this.ENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update() {
        if (this.ENTER.isDown) {
            this.scene.start('Game');
        }
    }
}