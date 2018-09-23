import Phaser from 'phaser';
import SplashBackground from '../assets/sky.png'

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'Splash' });
    }
    
    preload() {
      /*Creating the progress bar*/
      let progressBar = this.add.graphics();
      let progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(240, 270, 320, 50);

      /*Creating the Loading text*/
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      let loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
          font: '20px monospace',
          fill: '#ffffff'
        }
      });
      loadingText.setOrigin(0.5, 0.5);

      /*Percentage text*/
      let percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
      });
      percentText.setOrigin(0.5, 0.5);

      /*Loading splash background*/
      this.load.image('splash-background', SplashBackground);
      for (let i = 0; i < 500; i++) {
        this.load.image('splash-background'+i, 'splash-background');
      }

      let assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
      });
      assetText.setOrigin(0.5, 0.5);

      this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
      });

      this.load.on('fileprogress', function (file) {
        // assetText.setText('Loading asset: ' + file.key);
      });

      this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
      });
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