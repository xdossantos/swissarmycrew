import Phaser from 'phaser';

import sky from '../assets/sky.png';
import ground from '../assets/platform.png';
import star from '../assets/star.png';
import bomb from '../assets/bomb.png';
import dude from '../assets/dude.png';
import dudeSword from '../assets/dude_sword.png';
import fidgetSpinner from '../assets/fidget.png';
//import stairs_2 from '../assets/stairs.png';

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var enemy = false;
var Vx;
var lastShot = 0;
var bullets;
var arrObjectsBulletCollide = [];
//var staircases;

export default class Main extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  preload() {
    this.load.image('sky', sky);
    this.load.image('ground', ground);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.image('fidgetSpinner', fidgetSpinner);
    this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('dudeSword', dudeSword, { frameWidth: 32, frameHeight: 48 });
    //this.load.image('stairs_2', stairs_2);
  }

  create () {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
    arrObjectsBulletCollide[0] = [platforms]; 

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(800, 600, 'ground').setScale(4).refreshBody();
    
    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    //Used for going up stairs
    /*var Staircase = new Phaser.Class({
      Extends: Phaser.GameObjects.Image, 

      initialize: function staircase(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'stairs_2');
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
      },

      update: function(time, delta) {
        if ((player.x > this.x) && (player.x < this.x + this.width)) {
          var xO = this.x - this.width * 0.5;
          var yO = this.y + this.height * 0.5;

          player.y = yO -(player.x - xO);
          player.body.allowGravity = false;      
        }
      }
    });

    staircases = this.add.group({
      classType: Staircase,
      maxSize: 10,
      runChildUpdate: true
    });

    staircases.create(500, 500); */

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'melee_right',
      frames: [ { key: 'dudeSword', frame: 6 } ],
      frameRate: 10,
    });

    this.anims.create({
      key: 'melee_left',
      frames: [ { key: 'dudeSword', frame: 3 } ],
      frameRate: 10,
    });

    //bullets,  projectiles
      var Bullet = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,

      initialize: 

      function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'fidgetSpinner');
        this.speed = Phaser.Math.GetSpeed(400, 1);
      }, 

      fire: function(x, y, playerVelocity, lastShot) {
        this.setPosition(x, y);
        //if ((Phaser.time - 50) > lastShot) {
          if (playerVelocity < 0) {
            this.speed = Phaser.Math.GetSpeed(-400, 1);
          }
          else {
            this.speed = Phaser.Math.GetSpeed(400, 1);  
          };
          this.setActive(true);
          this.setVisible(true);
        //}
      },
      update: function(time, delta) {
        this.x += this.speed * delta;
        this.rotation += 1;

        if ((this.x >  2400) || (this.x < 0)) {
          this.setActive(false);
          this.setVisible(false);
        }
        var arrmax = 1;
        if (enemy) {
          arrmax = 0;
        }
        for (var i = 0; i < arrObjectsBulletCollide.length - arrmax; i++) {
          var arrTemp = [];
          if (i === 0) {
            arrTemp = arrObjectsBulletCollide[0][0].children;
          }
          if (i > 0) {
            arrTemp = arrObjectsBulletCollide[i].children;
          }
          for (var j = 0; j < arrTemp.size; j++) {
            var Obj = arrTemp.entries[j];
            var x = Obj.x - Obj.width * 0.5;
            var y = Obj.y - Obj.height * 0.5;
            //x2:1 < x1:1 < x2:2 or x2:1 < x1:2 < x2:2 and
            //y2:1 < y1:1 < y2:2 or y2:1 < y1:2 < y2:2 
            if ((((x < this.x) && (this.x < (x + Obj.width))) || ((x < (this.x + this.width)) && ((this.x + this.width) < (x + Obj.width)))) 
            && 
                (((y < this.y) && (this.y < (y + Obj.height))) || ((y < (this.y + this.height)) && ((this.y + this.height) < (y + Obj.height))))) {
              this.setActive(false);
              this.setVisible(false);
              if (i === 1) {
                Obj.setActive(false);
                Obj.setVisible(false);
              }
            }
          };
        };
      }
    });

    bullets = this.add.group({
         classType: Bullet,
         maxSize: 3,
         runChildUpdate: true
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //this.cameras.add(0, 0, 1600, 600);
    this.cameras.main.setBounds(0, 0, 2400, 1200);
    this.cameras.main.startFollow(player);
    this.cameras.main.setSize(window.screen.width, window.screen.height);    

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

      //  Give each star a slightly different bounce
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();
    arrObjectsBulletCollide[1] = bombs;

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, this.collectStar, null, this);
    this.physics.add.collider(player, bombs, this.hitBomb, null, this);


    this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.Shoot =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  }

  update () {
    if (gameOver)
    {
      return;
    }

    if (cursors.left.isDown)
    {
      player.setVelocityX(-160);
      Vx = -1;
      if (this.A.isDown) {
        player.anims.play('melee_left');
      } else {
        player.anims.play('left', true);
      }
      
    }
    else if (cursors.right.isDown)
    {
      player.setVelocityX(160);
      Vx = 1;
      if (this.A.isDown) {
        player.anims.play('melee_right');
      } else {
        player.anims.play('right', true);
      }
    }
    else
    {
      player.setVelocityX(0);

      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
      player.setVelocityY(-330);
    }
    if (this.Shoot.isDown) {
      var bullet = bullets.get();

      if (bullet) {
        bullet.fire(player.x, player.y, Vx, lastShot);
        //lastShot = Phaser.time; 
      }
    }

  }

  collectStar (player, star)
  {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
      //  A new batch of stars to collect
      stars.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

      });

      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
      enemy = true;
    }
  }

  hitBomb (player, bomb) {
    if (bomb.Active) {
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      gameOver = true;
    }
  }
}
