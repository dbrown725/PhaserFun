class PyramidScene extends Phaser.Scene {
  walker: Phaser.Physics.Arcade.Sprite;
  genie: Phaser.GameObjects.Sprite;
  ground: Phaser.Physics.Arcade.Image;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  coins: Phaser.Physics.Arcade.Image[];
  jumpButton: Phaser.Physics.Arcade.Sprite;
  leftButton: Phaser.Physics.Arcade.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  approvalsLabel: Phaser.GameObjects.Text;
  approvalsScore: Phaser.GameObjects.Text;
  genieText: Phaser.GameObjects.Text;
  genieText2: Phaser.GameObjects.Text;
  gameOver: Phaser.GameObjects.Text;
  bricks: Phaser.Physics.Arcade.Image[];
  doorInterior: Phaser.Physics.Arcade.Sprite;
  doorInteriorBlack: Phaser.Physics.Arcade.Sprite;
  doorInterior2: Phaser.Physics.Arcade.Sprite;
  doorInteriorBlack2: Phaser.Physics.Arcade.Sprite;
  smoke: Phaser.GameObjects.Sprite;
  camera: Phaser.Cameras.Scene2D.Camera;

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
  growSmoke = true;
  fadeOutStarted: boolean;

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
      this.score = 0;
      this.openDoor = false;
      this.isInitial = true;
      this.initialCount = 0;
      this.growSmoke = false;

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

preload (){
    }

  create() {

    var style = { font: '20px Roboto', fill: 'white' };
    this.approvalsLabel = this.add.text(10, 15, 'Approvals granted:', style);
    this.approvalsScore = this.add.text(170, 15, '1/3', style);

    this.genieText = this.add.text(250, 10, '', style);
    this.genieText2 = this.add.text(150, 50, '', style);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 35, 'ground').setScale(6, 2).refreshBody();

    this.walker = this.physics.add.sprite(10, this.sys.canvas.height * 0.15, 'walker', 'player_09.png');
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

    this.doorInterior2 = this.physics.add.staticSprite(this.sys.canvas.width, this.sys.canvas.height * .65, 'doorInterior');
    this.doorInterior2.setScale(1.35).refreshBody();
    this.doorInterior2.y = this.doorInterior2.y - 800;

    //Coins
    var brickLocation = [[.001, 2.2], [1, 2.2], [2, 2.2], [3, 2.2],[4, 2.2], [5, 2.2], [6, 2.2], [7, 2.2],
        [8, 2.2], [9, 2.2], [10, 2.2], [11, 2.2], [12, 2.2], [13, 2.2], [14, 2.2], [15, 2.2], [16, 2.2], [17, 2.2], [18, 2.2],
        [19, 2.2], [20, 2.2]];
    brickLocation.push([15, 4.6], [16, 4.6], [17, 4.6], [18, 4.6], [19, 4.6], [20, 4.6], [21, 4.6]);
    brickLocation.push([.01, 7], [1, 7], [2, 7], [3, 7],
        [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7], [14, 7],
        [15, 7], [16, 7], [17, 7]);

    this.bricks = [];
    brickLocation.forEach(function(value) {
      var newBrick = this.physics.add.staticSprite((value[0] * 32), this.sys.canvas.height - (value[1] * 32), 'sokoban', 'block_07.png');
      newBrick.setScale(.5).refreshBody();
      newBrick.setCollideWorldBounds(true);
      this.bricks.push(newBrick);
    }, this);
    this.physics.add.collider(this.walker, this.bricks);

    this.genie = this.add.sprite(this.sys.canvas.width * .90, this.sys.canvas.height * .125, 'genie');
    this.genie.setName('genie');
    this.genie.setOrigin(0, 0);
    this.genie.setScale(.2, .2);
    this.genie.y = this.genie.y - 800; //hide off screen for now

    this.smoke = this.add.sprite(this.sys.canvas.width * .95, this.sys.canvas.height * .295, 'smoke');
    this.smoke.setScale(.001);

    this.doorInterior = this.physics.add.staticSprite(5, this.sys.canvas.height * .05, 'doorInterior');
    this.doorInterior.setScale(1.35).refreshBody();

    var gameOverStyle = { font: '35px Roboto', fill: 'red' };
    this.gameOver = this.add.text(this.sys.canvas.width * .05, this.sys.canvas.height * .35, '', gameOverStyle);

    this.physics.add.collider(this.walker, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    //If not mobile don't show buttons
    //If not mobile don't show buttons
    if (this.isMobile == true) {
      this.jumpButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.1, this.sys.canvas.height * 0.88, 'btnJump');
      this.jumpButton.setScale(.9).refreshBody();
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

      this.leftButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.75, this.sys.canvas.height * 0.88, 'btnLeft');
      this.leftButton.setScale(.9).refreshBody();
      this.leftButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.moveLeft = true;
        this.moveRight = false;
      }, this);
      this.leftButton.setInteractive().on('pointerup', function(pointer, localX, localY, event) {
        this.moveLeft = false;
      }, this);
      this.leftButton.setInteractive().on('pointerout', function(pointer, localX, localY, event) {
        this.moveLeft = false;
      }, this);

      this.rightButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.9, this.sys.canvas.height * 0.88, 'btnRight');
      this.rightButton.setScale(.9).refreshBody();
      this.rightButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.moveRight = true;
        this.moveLeft = false;
      }, this);
      this.rightButton.setInteractive().on('pointerup', function(pointer, localX, localY, event) {
        this.moveRight = false;
      }, this);
      this.rightButton.setInteractive().on('pointerout', function(pointer, localX, localY, event) {
        this.moveRight = false;
      }, this);
    }

    //Coins
    this.anims.create({
        key: 'coinsSpin',
        frames: [
            { key: 'gold1', frame: '' },
            { key: 'gold2', frame: '' },
            { key: 'gold3', frame: '' },
            { key: 'gold4', frame: '' },
            { key: 'gold3flip', frame: '' },
            { key: 'gold2flip', frame: ''}
        ],
        frameRate: 5,
        repeat: -1
    });
    var coinLocation = [];
    coinLocation.push([-.5, .48], [.5, .48], [1.5, .48], [2.5, .48]);
    coinLocation.push([-1, .58], [.001, .58], [1, .58], [2, .58], [3, .58]);
    coinLocation.push([-1.5, .68], [-.5, .68], [.5, .68], [1.5, .68], [2.5, .68], [3.5, .68]);
    coinLocation.push([-.5, .2], [.5, .2], [1.5, .2], [2.5, .2], [3.5, .2], [4.5, .2], [5.5, .2], [6.5, .2], [7.5, .2]);
    coinLocation.push([6.7, .43], [7.7, .43], [8.7, .43], [9.7, .43]);
    this.coins = [];
    var min=1;
    var max=1000;
    coinLocation.forEach(function(value) {
      var newCoin = this.physics.add.staticSprite((this.sys.canvas.width * .225) + (value[0] * 50), this.sys.canvas.height * value[1], 'jumperSprites', 'gold_1.png');
      newCoin.setScale(.3).refreshBody();
      newCoin.setCollideWorldBounds(true);
      this.time.delayedCall(Math.random() * (+max - +min) + +min, this.setCoinSpin, [newCoin], this);
      this.coins.push(newCoin);
    }, this);
    this.physics.add.collider(this.walker, this.coins, this.coinCollision, null, this);
    this.sound.play('newPlayerAudio');
    this.camera = this.cameras.main;
    this.camera.on('camerafadeoutcomplete', function() {
        this.scene.start('Advertisement2Scene', {});
    }, this);
    this.camera.fadeIn(3000, 1);
    this.fadeOutStarted = false;
  }

  update(time: number, delta: number) {
    if(this.growSmoke) {
      if(this.smoke.scaleX < 2) {
        this.smoke.setScale(2);
      }
      if (this.smoke.scaleX <= 15 ) {
        this.smoke.alpha = this.smoke.alpha - .01;
        this.smoke.scaleX = this.smoke.scaleX * 1.01;
        this.smoke.scaleY = this.smoke.scaleY * 1.01;
      } else {
        this.growSmoke = false;
        this.smoke.setScale(.001);
        this.smoke.setAlpha(1);
      }
    }

    if(!this.fadeOutStarted && this.walker.x > 618 && this.walker.y > 210 ) {
        this.fadeOutStarted = true;
        this.cameras.main.fade(2000);
    }
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

  setCoinSpin(coin) {
    //hack for timing issue
    if(coin && coin.anims) {
      coin.anims.play('coinsSpin', true);
    }
  }

  coinCollision(walker, coin) {
    this.sound.play('coinAudio');
    coin.destroy();
    this.score = this.score + 1;
    if(this.score >= 21) {
        this.doorInterior.y = this.doorInterior.y - 800;
    }
    if(this.score >= 28) {
        var sceneThis = this;
        setTimeout(function() {
            sceneThis.genie.y = sceneThis.genie.y + 800;
            sceneThis.sound.play('smokeAudio');
            sceneThis.growSmoke = true;
        }, 1500);
        setTimeout(function() {
            sceneThis.genieText.text = 'Congrats on your second access approval.';
            sceneThis.approvalsScore.text = '2/3';
        }, 3000);
        setTimeout(function() {
            sceneThis.genieText.text = '';
            sceneThis.genieText2.text = 'Genie says: Always lock your computer screen.';
        }, 7000);
        setTimeout(function() {
            sceneThis.genie.y = sceneThis.genie.y + 800;
            sceneThis.sound.play('smokeAudio');
            sceneThis.growSmoke = true;
        }, 8000);
        setTimeout(function() {
            sceneThis.sound.play('doorAudio');
            sceneThis.doorInterior2.y = sceneThis.doorInterior2.y + 800;
        }, 10000);
    }
  }
}

export default PyramidScene;
