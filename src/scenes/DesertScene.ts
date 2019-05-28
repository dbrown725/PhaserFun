class DesertScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  tomb: Phaser.GameObjects.Sprite;
  door: Phaser.Physics.Arcade.Sprite;
  blocker: Phaser.Physics.Arcade.Sprite;
  walkerDesert: Phaser.Physics.Arcade.Sprite;
  genie: Phaser.GameObjects.Sprite;
  license: Phaser.GameObjects.Sprite;
  coin: Phaser.Physics.Arcade.Sprite;
  smoke: Phaser.GameObjects.Sprite;

  ground: Phaser.Physics.Arcade.Image;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  coins: Phaser.Physics.Arcade.Image[];
  jumpButton: Phaser.Physics.Arcade.Sprite;
  leftButton: Phaser.Physics.Arcade.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  approvalsLabel: Phaser.GameObjects.Text;
  approvalsScore: Phaser.GameObjects.Text;
  walkerSpeak: Phaser.GameObjects.Text;
  genieSpeak:  Phaser.GameObjects.Text;
  genieSpeak2:  Phaser.GameObjects.Text;
  genieSpeak3:  Phaser.GameObjects.Text;

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

  preload() {
    //visuals
    this.load.image('desertBG', '/assets/sprites/colored_desert_640_341.png');
    this.load.image('tomb', '/assets/sprites/tomb.png');
    this.load.image('door', '/assets/sprites/door.png');
    this.load.image('genie', '/assets/sprites/femaleGenie.png');
    this.load.image('blocker', '/assets/sprites/blocker.png');
    this.load.image('ground', 'assets/sprites/platformTransparent.png');
    this.load.image('coin', 'assets/sprites/coin.png');
    this.load.image('btnJump', 'assets/sprites/upButton.png');
    this.load.image('btnLeft', 'assets/sprites/leftButton.png');
    this.load.image('btnRight', 'assets/sprites/rightButton.png');
    this.load.atlas('walker', 'assets/sprites/leftRightWalk.png', 'assets/sprites/leftRightWalk.json');
    this.load.image('license', 'assets/sprites/license.png');
    this.load.image('gold1', 'assets/sprites/gold_1.png');
    this.load.image('gold2', 'assets/sprites/gold_2.png');
    this.load.image('gold3', 'assets/sprites/gold_3.png');
    this.load.image('gold4', 'assets/sprites/gold_4.png');
    this.load.image('gold3flip', 'assets/sprites/gold_3_flip.png');
    this.load.image('gold2flip', 'assets/sprites/gold_2_flip.png');
    this.load.atlasXML('jumperSprites', 'assets/sprites/spritesheet_jumper.png', 'assets/sprites/spritesheet_jumper.xml');
    this.load.image('smoke', '/assets/sprites/smoke.png');

    //audios
    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('newPlayerAudio', ['assets/audio/mb_new.mp3', 'assets/audio/mb_new.ogg']);
    this.load.audio('coinAudio', ['assets/audio/mb_coin.mp3', 'assets/audio/mb_coin.ogg']);
    this.load.audio('jumpAudio', ['assets/audio/smb_jump-small.mp3', 'assets/audio/smb_jump-small.ogg']);
    this.load.audio('doorAudio', ['assets/audio/door.mp3', 'assets/audio/door.ogg']);
    this.load.audio('smokeAudio', ['assets/audio/smoke-bomb.mp3', 'assets/audio/smoke-bomb.ogg']);
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'desertBG');

    this.tomb = this.add.sprite(this.sys.canvas.width * .825, this.sys.canvas.height * -.088, 'tomb');
    this.tomb.setName('tomb');
    this.tomb.setOrigin(0, 0);
    this.tomb.setScale(1.25, 1.25);
    this.tomb.setInteractive(true, function() { });

    this.genie = this.add.sprite(this.sys.canvas.width * .75, this.sys.canvas.height * .235, 'genie');
    this.genie.setName('genie');
    this.genie.setOrigin(0, 0);
    this.genie.setScale(.3, .3);
    this.genie.y = this.genie.y - 800; //hide off screen for now

    this.smoke = this.add.sprite(this.sys.canvas.width * .80, this.sys.canvas.height * .5, 'smoke');
    this.smoke.setScale(.001);

    this.license = this.add.sprite(this.sys.canvas.width * .20, this.sys.canvas.height * .25, 'license');
    this.license.setName('license');
    this.license.setOrigin(0, 0);
    this.license.setScale(.25, .25);
    this.license.y = this.license.y - 800; //hide off screen for now

    this.blocker = this.physics.add.staticSprite(this.sys.canvas.width * .999, this.sys.canvas.height * .690, 'blocker');
    this.blocker.setScale(1.35).refreshBody();
    this.blocker.setInteractive(true, function() { });

    this.door = this.physics.add.staticSprite(this.sys.canvas.width * .985, this.sys.canvas.height * .698, 'door');
    this.door.setScale(1.35).refreshBody();
    this.door.setInteractive(true, function() { });

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 40, 'ground').setScale(6, 2).refreshBody();

    this.walkerDesert = this.physics.add.sprite(10, this.sys.canvas.height * 0.1, 'walker', 'player_09.png');
    this.walkerDesert.setScale(0.30, 0.30);
    this.walkerDesert.setBounce(0.2);
    this.walkerDesert.setCollideWorldBounds(true);
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
    this.walkerSpeak = this.add.text(this.walkerDesert.x + 20, this.walkerDesert.y - 40, '', walkerStyle);

    this.physics.add.collider(this.walkerDesert, this.platforms);
    this.physics.add.collider(this.walkerDesert, this.blocker);

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

      //hide the buttons
      this.jumpButton.y = this.jumpButton.y - 800;
      this.leftButton.y = this.leftButton.y - 800;
      this.rightButton.y = this.rightButton.y - 800;
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

    var coinLocation = [[5, .2]];
    coinLocation.push([4.5, .3], [5.5, .3]);
    coinLocation.push([4, .4], [5, .4], [6, .4]);
    coinLocation.push([3.5, .5], [4.5, .5], [5.5, .5], [6.5, .5]);
    coinLocation.push([3, .6], [4, .6], [5, .6], [6, .6], [7, .6]);
    coinLocation.push([2.5, .7], [3.5, .7], [4.5, .7], [5.5, .7], [6.5, .7], [7.5, .7]);
    this.coins = [];
    var min=1;
    var max=1000;
    coinLocation.forEach(function(value) {
      var newCoin = this.physics.add.staticSprite((this.sys.canvas.width * .225) + (value[0] * 50), this.sys.canvas.height * value[1], 'jumperSprites', 'gold_1.png');
      newCoin.setScale(.3).refreshBody();
      newCoin.setCollideWorldBounds(true);
      newCoin.y = newCoin.y - 800;
      this.time.delayedCall(Math.random() * (+max - +min) + +min, this.setCoinSpin, [newCoin], this);
      this.coins.push(newCoin);
    }, this);

    this.physics.add.collider(this.walkerDesert, this.coins, this.coinCollision, null, this);
    console.log('navigator.userAgent', navigator.userAgent);

    //Scripted dialog
    var timer = 0;
    this.time.delayedCall(timer += 1500, this.jumpRight, null, this);
    this.time.delayedCall(timer += 1000, this.jumpLeft, null, this);
    this.time.delayedCall(timer += 1000, this.jumpRight, null, this);
    this.time.delayedCall(timer += 1000, this.jumpLeft, [true], this);
    this.time.delayedCall(timer += 1000, this.introRight, [true], this);
    this.time.delayedCall(timer += 4500, this.showGenie, null, this);
    this.time.delayedCall(timer += 1000, this.whoAreYou, null, this);
    this.time.delayedCall(timer += 2000, this.genieIntro, null, this);
    //this.time.delayedCall(timer += 2000, this.genieIntro2, null, this);
    this.time.delayedCall(timer += 2500, this.genieIntro3, null, this);
    this.time.delayedCall(timer += 3500, this.allTheCandy, null, this);
    this.time.delayedCall(timer += 3000, this.grantedAccess, null, this);
    //this.time.delayedCall(timer += 4000, this.howDoWeDoThat, null, this);
    this.time.delayedCall(timer += 3000, this.authorAndAthen, null, this);
    this.time.delayedCall(timer += 5500, this.justCandy, null, this);
    this.time.delayedCall(timer += 3000, this.authenticated, null, this);
    this.time.delayedCall(timer += 3000, this.sureHereYouGo, null, this);
    this.time.delayedCall(timer += 2000, this.showLicense, null, this);
    this.time.delayedCall(timer += 2000, this.youAreAuthenticated, null, this);
    //this.time.delayedCall(timer += 3000, this.allEars, null, this);
    this.time.delayedCall(timer += 2000, this.threeChallenges, null, this);
    this.time.delayedCall(timer += 5500, this.passedChallenges, null, this);
    this.time.delayedCall(timer += 4000, this.aLotOfWork, null, this);
    this.time.delayedCall(timer += 3500, this.importantWork, null, this);
    this.time.delayedCall(timer += 5500, this.doThis, null, this);
    this.time.delayedCall(timer += 3500, this.goodLuck, null, this);
    this.time.delayedCall(timer += 4000, this.hideGenie, null, this);
    this.time.delayedCall(timer += 2500, this.showCoins, null, this);
  }

  update(time: number, delta: number) {
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

    if(this.walkerDesert.x > 618 && this.walkerDesert.y > 227) {
        this.scene.start('Advertisement1Scene', {});
    }

    if (this.isFirstLoop == true) {

      if (this.isMobile == true) {
        //this.walkerDesert
      }
      this.isFirstLoop = false;
    }
    if ((this.cursors.left.isDown || this.moveLeft)
      && (this.walkerDesert.body.blocked.down || this.walkerDesert.body.touching.down)) // if the left arrow key is down or touch left button
    {
      this.walkerDesert.setVelocityX(-150); // move left
      this.walkerDesert.anims.play('walkLeft', true);
      this.walkerDirection = 'left';
      this.isPlayerMoving = true;
    }
    else if ((this.cursors.right.isDown || this.moveRight)
      && (this.walkerDesert.body.blocked.down || this.walkerDesert.body.touching.down)) // if the right arrow key is down or touch right button
    {
      this.walkerDesert.setVelocityX(150); // move right
      this.walkerDesert.anims.play('walkRight', true); // play walk animation
      this.walkerDirection = 'right';
      this.isPlayerMoving = true;
    } else if (this.walkerDesert.body.blocked.down || this.walkerDesert.body.touching.down) {
      this.walkerDesert.setVelocityX(0);
      this.isPlayerMoving = false;
      if (this.walkerDirection == 'right') {
        this.walkerDesert.anims.play('idleRight', true);
      } else {
        this.walkerDesert.anims.play('idleLeft', true);
      }
    }
    if ((this.cursors.space.isDown || this.cursors.up.isDown || this.jump)
      && (this.walkerDesert.body.blocked.down || this.walkerDesert.body.touching.down)) {
      this.walkerDesert.setVelocityY(-300); // jump up
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
        this.walkerDesert.setVelocityX(150);
      } else {
        this.walkerDesert.setVelocityX(-150);
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
    if(this.score >= 21) {
        //this.door.setY(this.door.y - 50);
        var timer2 = 0;
        this.time.delayedCall(timer2 += 2000, this.showGenieCongrats, null, this);
        this.time.delayedCall(timer2 += 4000, this.genieSecurityTip, null, this);
        this.time.delayedCall(timer2 += 6000, this.genieGoodLuck, null, this);
        this.time.delayedCall(timer2 += 4000, this.startDoorOpen, null, this);
    }
  }

  showGenieCongrats() {
      this.genie.y = this.genie.y + 800;
      this.sound.play('smokeAudio');
      this.growSmoke = true;
      this.genieSpeak.text = 'Congrats! You have completed your first challenge.';
      this.genieSpeak2.text = 'Here is your first authorization approval.';
      this.time.delayedCall(2000, function(){
          this.approvalsScore.text = '1/3';
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

  jumpRight() {
      this.walkerSpeak.x = this.walkerDesert.x + 20;
      this.walkerSpeak.y = this.walkerDesert.y - 40;
      this.walkerSpeak.text = 'Candy!'
      this.walkerDesert.setVelocityX(150); // move right
      this.sound.play('jumpAudio');
      this.walkerDesert.anims.play('walkRight', true); // play walk animation
      this.walkerDirection = 'right';
      this.isPlayerMoving = true;
      this.walkerDesert.setVelocityY(-150);
  }

  jumpLeft(final) {
      this.walkerSpeak.x = this.walkerDesert.x + 20;
      this.walkerSpeak.y = this.walkerDesert.y - 40;
      this.walkerDesert.setVelocityX(-150); // move left
      this.sound.play('jumpAudio');
      this.walkerDesert.anims.play('walkLeft', true); // play walk animation
      this.walkerDirection = 'left';
      this.isPlayerMoving = true;
      if(final) {
           this.walkerDesert.setVelocityY(-100);
            this.walkerDesert.setVelocityX(-100); // move left
      } else {
           this.walkerDesert.setVelocityY(-150);
            this.walkerDesert.setVelocityX(-150); // move left
      }

  }

  introRight(final) {
      this.walkerSpeak.x = this.walkerDesert.x + 20;
      this.walkerSpeak.y = this.walkerDesert.y - 60;
      this.walkerSpeak.text = 'I imagined candy heaven would have more candy than this.';
      this.walkerDirection = 'right';
  }

  introLeft(final) {
      this.walkerSpeak.text = '';
      if(final == true) {
          this.walkerSpeak.text = 'No candy?!?!'
      }
      // this.walkerDesert.setVelocityX(-100); // move right
      // this.walkerDesert.anims.play('walkLeft', true); // play walk animation
      this.walkerDirection = 'left';
      // this.isPlayerMoving = true;
  }

  showGenie() {
      //this.cameras.main.shake(500);
      this.growSmoke = true;
      this.walkerSpeak.text = '';
      this.genie.y = this.genie.y + 800;
      this.sound.play('smokeAudio');
      var genieStyle = { font: '40px Roboto', fill: 'black' };
      this.genieSpeak = this.add.text(this.genie.x - 180, this.genie.y - 40, 'Welcome!', genieStyle);
      this.time.delayedCall(750, function(){
          this.walkerSpeak.text = '';
          this.walkerDesert.setVelocityY(-200);
          this.sound.play('jumpAudio');
      }, null, this);

  }

  whoAreYou() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'Whoa, who are you!';
  }

  genieIntro() {
      this.genieSpeak.setFontSize(20);
      this.genieSpeak.x = this.genieSpeak.x - 180;
      this.genieSpeak.text = 'I am the Genie of Secure Access Management.';
      this.walkerSpeak.text = '';
  }

  whosaWhatsa() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'The whosa whatsa?';
  }

  genieIntro2() {
      this.genieSpeak.x = this.genieSpeak.x;
      this.genieSpeak.text = 'The Genie of Secure Access Management.';
      this.walkerSpeak.text = '';
  }

  genieIntro3() {
      var genieStyle = { font: '40px Roboto', fill: 'black' };
      this.genieSpeak2 = this.add.text(this.genieSpeak.x + 40, this.genieSpeak.y + 30, 'I am here to grant you an access wish.', this.genieSpeak.style);
      this.walkerSpeak.text = '';
  }

  allTheCandy() {
      this.walkerSpeak.x = this.walkerSpeak.x - 75;
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.walkerSpeak.text = 'Great! I wish I had access to the candy, all the candy!';
  }

  grantedAccess() {
      this.genieSpeak.x = this.genieSpeak.x - 100;
      this.walkerSpeak.text = '';
      this.genieSpeak.text = 'You shall receive your candy but first you must be granted access.';
  }

  howDoWeDoThat() {
      this.walkerSpeak.text = 'What?!?! How does that happen?';
      this.genieSpeak.text = '';
  }

  authorAndAthen() {
      this.walkerSpeak.text = '';
      this.genieSpeak2.x = this.genieSpeak2.x - 150;
      this.genieSpeak2.text = 'You must be Authenticated and then Authorized.';
      this.genieSpeak3 = this.add.text(this.genieSpeak2.x, this.genieSpeak2.y + 30, 'These are the two hallmarks of good access management.', this.genieSpeak.style);
  }

  justCandy() {
      this.walkerSpeak.x = this.walkerSpeak.x - 40;
      this.walkerSpeak.text = 'It is just candy but I will play along, where do we start?';
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.genieSpeak3.text = '';
  }

  authenticated() {
      this.walkerSpeak.text = '';
      this.genieSpeak.text = 'You must be authenticated, do you have a valid ID?';
  }

  sureHereYouGo() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'Sure, here you go.';
  }

  showLicense() {
      this.walkerSpeak.text = '';
      this.license.y = this.license.y + 800;
  }

  youAreAuthenticated() {
      this.license.destroy();
      this.genieSpeak.y = this.genieSpeak.y - 20;
      this.genieSpeak.text = 'Perfect, you are officially Authenticated, now you need to be authorized.';
  }

  allEars() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'I am all ears, how do we do that?';
  }

  threeChallenges() {
      this.genieSpeak.x = this.genieSpeak.x;
      this.walkerSpeak.text = '';
      this.genieSpeak2.y = this.genieSpeak2.y - 20;
      this.genieSpeak2.text = 'You must collect three authorization approvals by entering three challenges.';
  }

  passedChallenges() {
      this.genieSpeak.y = this.genieSpeak.y + 20;
      this.genieSpeak2.y = this.genieSpeak2.y + 20;
      this.genieSpeak.text = 'Once you have passed all three challenges ';
      this.genieSpeak2.text = 'you will be granted access to your candy.';
  }

  aLotOfWork() {
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.walkerSpeak.text = 'Seems like a lot of work just to access some candy.';
  }

  importantWork() {
      this.genieSpeak.text = 'Yes, it is a lot of work, a lot of very important work.';
      this.genieSpeak2.x = this.genieSpeak2.x + 40;
      this.genieSpeak2.text = 'Secure access management is mission critical!';
      this.walkerSpeak.text = '';
  }

  doThis() {
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.walkerSpeak.text = 'Ok, let\'s do this.';
  }

  goodLuck() {
      this.genieSpeak.text = 'Welcome to the first challenge and good luck!';
      this.genieSpeak2.text = 'Hint: get all the coins.';
      this.walkerSpeak.text = '';
  }

  hideGenie() {
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.genie.y = this.genie.y - 800;
      this.sound.play('smokeAudio');
      this.growSmoke = true;
  }

  showCoins() {
      this.sound.play('newPlayerAudio');
      var style = { font: '20px Roboto', fill: 'black' };
      this.approvalsLabel = this.add.text(10, 15, 'Approvals granted:', style);
      this.approvalsScore = this.add.text(170, 15, '0/3', style);
      this.coins.forEach(function(value) {
          value.y = value.y + 800;
      }, this);
      if (this.isMobile == true) {
          //show the buttons
          this.jumpButton.y = this.jumpButton.y + 800;
          this.leftButton.y = this.leftButton.y + 800;
          this.rightButton.y = this.rightButton.y + 800;
      }
  }
}

export default DesertScene;
