class DesertScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  tomb: Phaser.GameObjects.Sprite;
  door: Phaser.Physics.Arcade.Sprite;
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

  constructor() {
    super({
      key: 'DesertScene'
    });
  }

  init() {
      this.isPlayerMidJump = false;
      this.isPlayerMoving = false;
      this.isFirstLoop = true;
      this.isMobile = false;
      this.score = 0;
      this.openDoor = false;

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

  preload() {
    //visuals
    this.load.image('desertBG', '/assets/sprites/colored_desert_640_341.png');
    this.load.image('tomb', '/assets/sprites/tomb.png');
    this.load.image('door', '/assets/sprites/door.png');
    this.load.image('ground', 'assets/sprites/platformTransparent.png');
    this.load.image('coin', 'assets/sprites/coin.png');
    this.load.image('btnJump', 'assets/sprites/button_jump.png');
    this.load.image('btnLeft', 'assets/sprites/button_left_grey.png');
    this.load.image('btnRight', 'assets/sprites/button_right_grey.png');
    this.load.atlas('walker', 'assets/sprites/leftRightWalk.png', 'assets/sprites/leftRightWalk.json');

    //audios
    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('newPlayerAudio', ['assets/audio/mb_new.mp3', 'assets/audio/mb_new.ogg']);
    this.load.audio('coinAudio', ['assets/audio/mb_coin.mp3', 'assets/audio/mb_coin.ogg']);
    this.load.audio('jumpAudio', ['assets/audio/smb_jump-small.mp3', 'assets/audio/smb_jump-small.ogg']);
    this.load.audio('doorAudio', ['assets/audio/door.mp3', 'assets/audio/door.ogg']);
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'desertBG');

    var style = { font: '20px Roboto', fill: 'grey' };
    this.coinsLabel = this.add.text(10, 15, 'Coins:', style);
    this.coinsScore = this.add.text(80, 15, '0', style);

    this.tomb = this.add.sprite(this.sys.canvas.width * .825, this.sys.canvas.height * -.083, 'tomb');
    this.tomb.setName('tomb');
    this.tomb.setOrigin(0, 0);
    this.tomb.setScale(1.25, 1.25);
    this.tomb.setInteractive(true, function() { });

    this.door = this.physics.add.staticSprite(this.sys.canvas.width * .985, this.sys.canvas.height * .703, 'door');
    this.door.setScale(1.35).refreshBody();
    this.door.setInteractive(true, function() { });

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 35, 'ground').setScale(6, 2).refreshBody();

    this.walker = this.physics.add.sprite(10, this.sys.canvas.height * 0.1, 'walker', 'player_09.png');
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
    var coinLocation = [[5, .2]];
    coinLocation.push([4.5, .3], [5.5, .3]);
    coinLocation.push([4, .4], [5, .4], [6, .4]);
    coinLocation.push([3.5, .5], [4.5, .5], [5.5, .5], [6.5, .5]);
    coinLocation.push([3, .6], [4, .6], [5, .6], [6, .6], [7, .6]);
    coinLocation.push([2.5, .7], [3.5, .7], [4.5, .7], [5.5, .7], [6.5, .7], [7.5, .7]);
    this.coins = [];
    coinLocation.forEach(function(value) {
      var newCoin = this.physics.add.staticSprite((this.sys.canvas.width * .225) + (value[0] * 50), this.sys.canvas.height * value[1], 'coin');
      newCoin.setScale(.05).refreshBody();
      newCoin.setCollideWorldBounds(true);
      this.coins.push(newCoin);
    }, this);
    this.physics.add.collider(this.walker, this.coins, this.coinCollision, null, this);
    this.sound.play('newPlayerAudio');
    console.log('navigator.userAgent', navigator.userAgent);

  }

  update(time: number, delta: number) {

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

    //open door slowly
    if(this.openDoor && this.door.y > 155) {
        this.door.setY(this.door.y - .5);
    }
  }

  coinCollision(walker, coin) {
    this.sound.play('coinAudio');
    coin.destroy();
    this.score = this.score + 1;
    this.coinsScore.text = this.score.toString();
    if(this.score == 21) {
        //this.door.setY(this.door.y - 50);
        var sceneContext = this;
        setTimeout(function() {
          sceneContext.openDoor = true;
          sceneContext.sound.play('doorAudio');
      }, 1500);
    }
  }
}

export default DesertScene;
