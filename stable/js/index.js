
import Game from './game';
import Splash from './splash';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [Splash, Game]
};

new Phaser.Game(config);

if (module.hot) {
  module.hot.accept(() => { });

  module.hot.dispose(() => {
    window.location.reload();
  });
}
