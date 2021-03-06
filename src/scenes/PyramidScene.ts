class PyramidScene extends Phaser.Scene {
  walker: Phaser.Physics.Arcade.Sprite;
  ground: Phaser.Physics.Arcade.Image;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  coins: Phaser.Physics.Arcade.Image[];
  jumpButton: Phaser.Physics.Arcade.Sprite;
  leftButton: Phaser.Physics.Arcade.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  coinsLabel: Phaser.GameObjects.Text;
  coinsScore: Phaser.GameObjects.Text;
  gameOver: Phaser.GameObjects.Text;
  bricks: Phaser.Physics.Arcade.Image[];
  doorInterior: Phaser.Physics.Arcade.Sprite;
  doorInteriorBlack: Phaser.Physics.Arcade.Sprite;

  cursors: any;
  walkerDirection: string;
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  isPlayerMidJump: boolean;
  isPlayerMoving: boolean;
  isFirstLoop: boolean;
  isMobile: boolean;
  score: integer;
  openDoor: boolean;
  isInitial: boolean;
  initialCount: integer;

  constructor() {
    super({
      key: 'PyramidScene'
    });
  }

  init(data) {
      this.isPlayerMidJump = false;
      this.isPlayerMoving = false;
      this.isFirstLoop = true;
      this.isMobile = false;
      console.log('data', data);
      this.score = data.score;
      this.openDoor = false;
      this.isInitial = true;
      this.initialCount = 0;

      //Allows for default pointer plus one. Needed so the jump button
      //and a left or right button can be pressed at the same time
      this.input.addPointer(1);

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent)) {
        console.log('is mobile');
        this.isMobile = true;
      } else if (/Edge/i.test(navigator.userAgent)) {
        console.log('is not mobile, Edge');
        this.isMobile = false;
      } else if (/Chrome/i.test(navigator.userAgent)) {
        console.log('is not mobile, Chrome');
        this.isMobile = false;
      } else {
        console.log('is not mobile');
        this.isMobile = false;
      }
  }

preload ()
    {
        this.load.atlasXML('sokoban', 'assets/sprites/sokoban_spritesheet.png', 'assets/sprites/sokoban_spritesheet.xml');
        this.load.atlasXML('round', 'assets/sprites/round.png', 'assets/sprites/round.xml');
        this.load.image('doorInterior', '/assets/sprites/door_interior.png');
        this.load.image('doorInteriorBlack', '/assets/sprites/door_interior_black.png');
    }


  create() {

    var style = { font: '20px Roboto', fill: 'grey' };
    this.coinsLabel = this.add.text(10, 15, 'Coins:', style);
    this.coinsScore = this.add.text(80, 15, this.score.toString(), style);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 35, 'ground').setScale(6, 2).refreshBody();

    this.walker = this.physics.add.sprite(10, this.sys.canvas.height * 0.35, 'walker', 'player_09.png');
    this.walker.setScale(0.30, 0.30);
    this.walker.setBounce(0.2);
    this.walker.setCollideWorldBounds(true);
    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNames('walker', { prefix: 'player_', suffix: '.png', start: 12, end: 14, zeroPad: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNames('walker', { prefix: 'player_', suffix: '.png', start: 9, end: 11, zeroPad: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idleRight',
      frames: [{ key: 'walker', frame: 'player_09.png' }],
      frameRate: 10,
    });
    this.anims.create({
      key: 'idleLeft',
      frames: [{ key: 'walker', frame: 'player_12.png' }],
      frameRate: 10,
    });
    this.walkerDirection = 'right';

    // this.brick = this.physics.add.staticSprite((this.sys.canvas.width * .225) + (1 * 50), this.sys.canvas.height * .7, 'sokoban', 'ground_01.png');
    // this.brick.setScale(1).refreshBody();
    // this.brick.setCollideWorldBounds(true);
    // this.physics.add.collider(this.walker, this.brick);

    //Coins
    var brickLocation = [[4, 2.65], [5, 2.65], [6, 2.65], [7, 2.65],
        [8, 2.65], [9, 2.65], [10, 2.65], [11, 2.65], [12, 2.65], [13, 2.65]];
    brickLocation.push([15, 5], [16, 5.5], [17, 6], [18, 6],  [19, 6], [20, 6], [21, 6]);
    brickLocation.push([4, 8], [5, 8], [6, 8], [7, 8],
        [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8]);

    this.bricks = [];
    brickLocation.forEach(function(value) {
      var newBrick = this.physics.add.staticSprite((value[0] * 32), this.sys.canvas.height - (value[1] * 32), 'sokoban', 'block_07.png');
      newBrick.setScale(.5).refreshBody();
      newBrick.setCollideWorldBounds(true);
      this.bricks.push(newBrick);
    }, this);
    this.physics.add.collider(this.walker, this.bricks);

    this.doorInterior = this.physics.add.staticSprite(5, this.sys.canvas.height * .3, 'doorInterior');
    this.doorInterior.setScale(1.35).refreshBody();

    this.doorInteriorBlack = this.physics.add.staticSprite(5, this.sys.canvas.height * .15, 'doorInteriorBlack');
    this.doorInteriorBlack.setScale(1.35).refreshBody();

    var gameOverStyle = { font: '100px Roboto', fill: 'red' };
    this.gameOver = this.add.text(this.sys.canvas.width * .12, this.sys.canvas.height * .25, '', gameOverStyle);

    this.physics.add.collider(this.walker, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    //If not mobile don't show buttons
    if (this.isMobile == true) {
      this.jumpButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.1, this.sys.canvas.height * 0.92, 'btnJump');
      this.jumpButton.setScale(1).refreshBody();
      this.jumpButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.jump = true;
      }, this);
      this.jumpButton.setInteractive().on('pointerUp', function(pointer, localX, localY, event) {
        this.jump = false;
      }, this);
      this.jumpButton.setInteractive().on('pointerout', function(pointer, localX, localY, event) {
        this.jump = false;
      }, this);
      this.jumpButton.setInteractive().on('pointermove', function(pointer, localX, localY, event) {
        this.jump = false;
      }, this);

      this.leftButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.7, this.sys.canvas.height * 0.92, 'btnLeft');
      this.leftButton.setScale(1).refreshBody();
      this.leftButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.moveLeft = true;
      }, this);
      this.leftButton.setInteractive().on('pointerup', function(pointer, localX, localY, event) {
        this.moveLeft = false;
      }, this);
      this.leftButton.setInteractive().on('pointerout', function(pointer, localX, localY, event) {
        this.moveLeft = false;
      }, this);

      this.rightButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.9, this.sys.canvas.height * 0.92, 'btnRight');
      this.rightButton.setScale(1).refreshBody();
      this.rightButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.moveRight = true;
      }, this);
      this.rightButton.setInteractive().on('pointerup', function(pointer, localX, localY, event) {
        this.moveRight = false;
      }, this);
      this.rightButton.setInteractive().on('pointerout', function(pointer, localX, localY, event) {
        this.moveRight = false;
      }, this);
    }

    //Coins
    var coinLocation = [[2, .3]];
    coinLocation.push([1.5, .4], [2.5, .4]);
    coinLocation.push([1, .5], [2, .5], [3, .5]);
    coinLocation.push([.5, .6], [1.5, .6], [2.5, .6], [3.5, .6]);
    coinLocation.push([.5, .1], [1.5, .1], [2.5, .1], [3.5, .1], [4.5, .1]);
    coinLocation.push([6.7, .37], [7.35, .31], [8, .27], [8.75, .27], [9.5, .27]);
    this.coins = [];
    coinLocation.forEach(function(value) {
      var newCoin = this.physics.add.staticSprite((this.sys.canvas.width * .225) + (value[0] * 50), this.sys.canvas.height * value[1], 'coin');
      newCoin.setScale(.05).refreshBody();
      newCoin.setCollideWorldBounds(true);
      this.coins.push(newCoin);
    }, this);
    this.physics.add.collider(this.walker, this.coins, this.coinCollision, null, this);
    this.sound.play('newPlayerAudio');
  }

  update(time: number, delta: number) {

    if(this.isInitial) {
        this.initialCount = this.initialCount + 1;
        this.walker.x = this.walker.x + .5;
        if(this.initialCount > 80) {
            this.isInitial = false;
        }
    }

    if (this.isFirstLoop == true) {

      if (this.isMobile == true) {
        //this.walker
      }
      this.isFirstLoop = false;
    }
    if ((this.cursors.left.isDown || this.moveLeft)
      && (this.walker.body.blocked.down || this.walker.body.touching.down)) // if the left arrow key is down or touch left button
    {
      this.walker.setVelocityX(-150); // move left
      this.walker.anims.play('walkLeft', true);
      this.walkerDirection = 'left';
      this.isPlayerMoving = true;
    }
    else if ((this.cursors.right.isDown || this.moveRight)
      && (this.walker.body.blocked.down || this.walker.body.touching.down)) // if the right arrow key is down or touch right button
    {
      this.walker.setVelocityX(150); // move right
      this.walker.anims.play('walkRight', true); // play walk animation
      this.walkerDirection = 'right';
      this.isPlayerMoving = true;
    } else if (this.walker.body.blocked.down || this.walker.body.touching.down) {
      this.walker.setVelocityX(0);
      this.isPlayerMoving = false;
      if (this.walkerDirection == 'right') {
        this.walker.anims.play('idleRight', true);
      } else {
        this.walker.anims.play('idleLeft', true);
      }
    }
    if ((this.cursors.space.isDown || this.cursors.up.isDown || this.jump)
      && (this.walker.body.blocked.down || this.walker.body.touching.down)) {
      this.walker.setVelocityY(-300); // jump up
      this.isPlayerMidJump = true;
      this.sound.play('jumpAudio');
      var sceneContext = this;
      setTimeout(function() {
        sceneContext.isPlayerMidJump = false;
      }, 2000);
    }
    if (this.isPlayerMoving
      && this.isPlayerMidJump
      && !this.cursors.space.isDown
      && !this.cursors.up.isDown
    ) {
      if (this.walkerDirection == 'right') {
        this.walker.setVelocityX(150);
      } else {
        this.walker.setVelocityX(-150);
      }
    }
  }

  coinCollision(walker, coin) {
    this.sound.play('coinAudio');
    coin.destroy();
    this.score = this.score + 1;
    this.coinsScore.text = this.score.toString();
    if(this.score >= 41) {
        //this.door.setY(this.door.y - 50);
        var sceneContext = this;
        setTimeout(function() {
            sceneContext.gameOver.text = "Game Over";
      }, 1500);
    }
  }
}

export default PyramidScene;
