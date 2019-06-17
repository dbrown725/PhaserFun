class GiantScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  tomb: Phaser.GameObjects.Sprite;
  door: Phaser.Physics.Arcade.Sprite;
  blocker: Phaser.Physics.Arcade.Sprite;
  walker: Phaser.Physics.Arcade.Sprite;
  genie: Phaser.GameObjects.Sprite;
  coin: Phaser.Physics.Arcade.Sprite;
  smoke: Phaser.GameObjects.Sprite;

  ground: Phaser.Physics.Arcade.Image;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  giantPlatforms: Phaser.Physics.Arcade.StaticGroup;
  giantGroupGroundObject: Phaser.GameObjects.Sprite;
  coins: Phaser.Physics.Arcade.Image[];
  jumpButton: Phaser.Physics.Arcade.Sprite;
  leftButton: Phaser.Physics.Arcade.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  approvalsLabel: Phaser.GameObjects.Text;
  approvalsScore: Phaser.GameObjects.Text;
  walkerSpeak: Phaser.GameObjects.Text;
  genieSpeak:  Phaser.GameObjects.Text;
  genieSpeak2:  Phaser.GameObjects.Text;
  castleWall: Phaser.GameObjects.Sprite;
  castleWall2: Phaser.GameObjects.Sprite;
  castleWall3: Phaser.GameObjects.Sprite;
  greyTower1: Phaser.GameObjects.Sprite;
  greyTower2: Phaser.GameObjects.Sprite;
  giant: Phaser.Physics.Arcade.Sprite;
  bigGiant: Phaser.Physics.Arcade.Sprite;
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
  growSmoke: boolean
  secondsPassed: integer;
  fadeOutStarted: boolean;
  bigGiantJumped: boolean;

  constructor() {
    super({
      key: 'GiantScene'
    });
  }

  init() {
      this.isPlayerMidJump = false;
      this.isPlayerMoving = false;
      this.isFirstLoop = true;
      this.isMobile = false;
      this.score = 0;
      this.openDoor = false;
      this.growSmoke = false;
      this.secondsPassed = 0;
      this.bigGiantJumped = false;

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
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'desertBG');

    this.giant = this.physics.add.sprite(this.sys.canvas.width + 100, this.sys.canvas.height * .215, 'castleGiant');
    this.giant.setName('giantOfCastle');
    this.giant.setOrigin(0, 0);
    this.giant.setScale(.25, .25);

    this.castleWall = this.add.sprite(this.sys.canvas.width * .295, this.sys.canvas.height * .315, 'wallCastle');
    this.castleWall.setName('castleWall1');
    this.castleWall.setOrigin(0, 0);
    this.castleWall.setScale(1, 1);

    this.castleWall2 = this.add.sprite(this.sys.canvas.width * .725, this.sys.canvas.height * .315, 'wallCastle');
    this.castleWall2.setName('castleWall2');
    this.castleWall2.setOrigin(0, 0);
    this.castleWall2.setScale(1, 1);

    this.castleWall3 = this.add.sprite(this.sys.canvas.width * -.125, this.sys.canvas.height * .315, 'wallCastle');
    this.castleWall3.setName('castleWall3');
    this.castleWall3.setOrigin(0, 0);
    this.castleWall3.setScale(1, 1);

    this.greyTower1 = this.add.sprite(this.sys.canvas.width * .245, this.sys.canvas.height * .04, 'towerGrey');
    this.greyTower1.setName('grreyTower1');
    this.greyTower1.setOrigin(0, 0);
    this.greyTower1.setScale(1, 1);

    this.greyTower2 = this.add.sprite(this.sys.canvas.width * .685, this.sys.canvas.height * .04, 'towerGrey');
    this.greyTower2.setName('greyTower2');
    this.greyTower2.setOrigin(0, 0);
    this.greyTower2.setScale(1, 1);

    this.tomb = this.add.sprite(this.sys.canvas.width * .825, this.sys.canvas.height * -.088, 'tomb');
    this.tomb.setName('tomb');
    this.tomb.setOrigin(0, 0);
    this.tomb.setScale(1.25, 1.25);

    this.genie = this.add.sprite(this.sys.canvas.width * .75, this.sys.canvas.height * .235, 'genie');
    this.genie.setName('genie');
    this.genie.setOrigin(0, 0);
    this.genie.setScale(.3, .3);
    this.genie.y = this.genie.y - 800; //hide off screen for now

    this.smoke = this.add.sprite(this.sys.canvas.width * .80, this.sys.canvas.height * .5, 'smoke');
    this.smoke.setScale(.001);

    this.blocker = this.physics.add.staticSprite(this.sys.canvas.width * .999, this.sys.canvas.height * .690, 'blocker');
    this.blocker.setScale(1.35).refreshBody();

    this.door = this.physics.add.staticSprite(this.sys.canvas.width * .985, this.sys.canvas.height * .698, 'door');
    this.door.setScale(1.35).refreshBody();

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 40, 'ground').setScale(6, 2).refreshBody();

    this.giantPlatforms = this.physics.add.staticGroup();
    this.giantGroupGroundObject = this.giantPlatforms.create(0, this.sys.canvas.height - 60, 'ground').setScale(6, 2).refreshBody();

    var style = { font: '20px Roboto', fill: 'black' };
    this.approvalsLabel = this.add.text(10, 15, 'Approvals granted:', style);
    this.approvalsScore = this.add.text(170, 15, '2/3', style);

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

    var walkerStyle = { font: '20px Roboto', fill: 'black' };
    this.walkerSpeak = this.add.text(this.walker.x + 20, this.walker.y - 40, '', walkerStyle);

    this.bigGiant = this.physics.add.sprite(-300, -500, 'castleGiant');
    this.bigGiant.setName('bigGiant');
    this.bigGiant.setOrigin(0, 0);
    this.bigGiant.setScale(-.75, .75);

    this.physics.add.collider(this.walker, this.platforms);
    this.physics.add.collider(this.walker, this.blocker);
    this.physics.add.collider(this.giant, this.giantPlatforms);
    this.physics.add.collider(this.bigGiant, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

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

    var coinLocation = [[3.5, .3], [4.5, .3], [5.5, .3]];
    coinLocation.push([3, .4], [4, .4], [5, .4], [6, .4]);
    coinLocation.push([2.5, .5], [3.5, .5], [4.5, .5], [5.5, .5], [6.5, .5]);
    coinLocation.push([2, .6], [3, .6], [4, .6], [5, .6], [6, .6], [7, .6]);
    coinLocation.push([1.5, .7], [2.5, .7], [3.5, .7], [4.5, .7], [5.5, .7], [6.5, .7], [7.5, .7]);
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

    this.camera = this.cameras.main;
    this.camera.on('camerafadeoutcomplete', function() {
        this.scene.start('CandyHeavenScene', {});
    }, this);
    this.camera.fadeIn(3000, 1);
    this.fadeOutStarted = false;
  }

  update(time: number, delta: number) {
    if(!this.giant.body.touching.down && this.giant.x > -200 && !this.openDoor)  {
        this.giant.setVelocityX(-90);
    } else if(this.openDoor){
        if(this.bigGiant.x < 300) {
            this.bigGiant.setVelocityX(200);
            if(!this.bigGiantJumped) {
                this.bigGiantJumped = true;
                this.bigGiant.setVelocityY(-450);
                this.time.delayedCall(3000, function(){
                    this.sound.play('giantStepAudio');
                    this.cameras.main.shake(500, .1);
                }, null, this);
            }
        } else {
            this.bigGiant.setVelocityX(0);
        }
    } else {
        this.giant.setVelocityX(0);
    }
    if(this.growSmoke) {
      if(this.smoke.scaleX < 4) {
        this.smoke.setScale(4);
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

    //var timeInSeconds = Math.floor( time / 1000);
    if(this.secondsPassed + 1400 < time && this.score > 0 && !this.openDoor) {
      this.secondsPassed = time;
      this.sound.play('giantStepAudio');
      this.time.delayedCall(400, function(){
          this.cameras.main.shake(500, .005);
          this.giant.setVelocityY(-200);
      }, null, this);
    }

    if(!this.fadeOutStarted && (this.walker.x > 618 && this.walker.y > 227)) {
        this.fadeOutStarted = true;
        //hide the buttons
        this.jumpButton.y = this.jumpButton.y - 800;
        this.leftButton.y = this.leftButton.y - 800;
        this.rightButton.y = this.rightButton.y - 800;
        this.cameras.main.fade(2000);
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

  setCoinSpin(coin) {
    coin.anims.play('coinsSpin', true);
  }

  coinCollision(walker, coin) {
    this.sound.play('coinAudio');
    coin.destroy();
    this.score = this.score + 1;
    //this.approvalsScore.text = this.score.toString();
    if(this.score >= 25) {
        //this.door.setY(this.door.y - 50);
        var timer2 = 0;
        this.time.delayedCall(timer2 += 2000, this.showGenieCongrats, null, this);
        //this.time.delayedCall(timer2 += 4000, this.genieSecurityTip, null, this);
        //this.time.delayedCall(timer2 += 6000, this.genieGoodLuck, null, this);
        this.time.delayedCall(timer2 += 6000, this.startDoorOpen, null, this);
    }
  }

  showGenieCongrats() {
      this.genie.y = this.genie.y + 800;
      this.sound.play('smokeAudio');
      this.growSmoke = true;
      var genieStyle = { font: '20px Roboto', fill: 'black' };
      this.genieSpeak = this.add.text(this.genie.x - 440, this.genie.y + 100, '', genieStyle);
      this.genieSpeak.text = 'Congrats! You have completed all three challenges.';
      this.genieSpeak2 = this.add.text(this.genie.x - 410, this.genie.y + 140, '', genieStyle);
      this.genieSpeak2.text = 'You have been granted access to candy heaven.';
      this.time.delayedCall(2000, function(){
          this.approvalsScore.text = '3/3';
      }, null, this);
  }

  startDoorOpen() {
      this.genie.y = this.genie.y - 800;
      this.sound.play('smokeAudio');
      this.growSmoke = true;
      this.openDoor = true;
      this.blocker.destroy();
      this.sound.play('doorAudio');
  }

  genieSecurityTip() {
      this.genieSpeak.y = this.genieSpeak.y + 60;
      this.genieSpeak2.y = this.genieSpeak2.y + 60;
      this.genieSpeak.text = 'The Genie says: Always secure your passwords.';
      this.genieSpeak2.text = 'Never share your passwords with anyone!';
  }

  genieGoodLuck() {
      this.genieSpeak.y = this.genieSpeak.y + 30;
      this.genieSpeak2.y = this.genieSpeak2.y + 30;
      this.genieSpeak.text = 'Good luck on your next challenge!';
      this.genieSpeak2.text = '';
  }

  hideGenie() {
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.genie.y = this.genie.y - 800;
      this.sound.play('smokeAudio');
      this.growSmoke = true;
  }
}

export default GiantScene;
