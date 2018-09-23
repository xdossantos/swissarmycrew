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
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
//enemy is temporary
var enemy;
var Vx;
var lastShot = 0;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('dudeSword', 'assets/dude_sword.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  //  A simple background for our game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

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

  //this is temp to test the projectiles
  enemy = this.physics.add.sprite(400, 512, 'dude');

  enemy.setBounce(0);
  enemy.setCollideWorldBounds(true);

  //bullets,  projectiles
    var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: 

    function Bullet(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'star');
      this.speed = Phaser.Math.GetSpeed(400, 1);
    }, 

    fire: function(x, y, playerVelocity, lastShot) {
      this.setPosition(x, y);
      //if ((Phaser.time - 1) > lastShot) {
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

      if ((this.x >  800) || (this.x < 0)) {
        this.setActive(false);
        this.setVisible(false);
      }
      //x2:1 < x1:1 < x2:2 or x2:1 < x1:2 < x2:2 and
      //y2:1 < y1:1 < y2:2 or y2:1 < y1:2 < y2:2 
      if ((((enemy.x < this.x) && (this.x < (enemy.x + enemy.width))) || ((enemy.x < (this.x + this.width)) && ((this.x + this.width) < (enemy.x + enemy.width)))) 
        && 
          (((enemy.y < this.y) && (this.y < (enemy.y + enemy.height))) || ((enemy.y < (this.y + this.height)) && ((this.y + this.height) < (enemy.y + enemy.height))))) {
        this.setActive(false);
        this.setVisible(false);
      }
    }
  });

  bullets = this.add.group({
       classType: Bullet,
       maxSize: 10,
       runChildUpdate: true
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

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

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);
  //temp
  this.physics.add.collider(enemy, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);

  // define custom keys
  this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.Shoot =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
}

function update ()
{
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

function collectStar (player, star)
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

  }
}

function hitBomb (player, bomb)
{
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}