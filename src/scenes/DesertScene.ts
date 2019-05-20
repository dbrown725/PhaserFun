class DesertScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  tomb: Phaser.GameObjects.Sprite;
  door: Phaser.Physics.Arcade.Sprite;
  blocker: Phaser.Physics.Arcade.Sprite;
  walker: Phaser.Physics.Arcade.Sprite;
  genie: Phaser.GameObjects.Sprite;
  license: Phaser.GameObjects.Sprite;

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
    this.load.image('genie', '/assets/sprites/femaleGenie.png');
    this.load.image('blocker', '/assets/sprites/blocker.png');
    this.load.image('ground', 'assets/sprites/platformTransparent.png');
    this.load.image('coin', 'assets/sprites/coin.png');
    this.load.image('btnJump', 'assets/sprites/button_jump.png');
    this.load.image('btnLeft', 'assets/sprites/button_left_grey.png');
    this.load.image('btnRight', 'assets/sprites/button_right_grey.png');
    this.load.atlas('walker', 'assets/sprites/leftRightWalk.png', 'assets/sprites/leftRightWalk.json');
    this.load.image('license', 'assets/sprites/license.png');//audios
    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('newPlayerAudio', ['assets/audio/mb_new.mp3', 'assets/audio/mb_new.ogg']);
    this.load.audio('coinAudio', ['assets/audio/mb_coin.mp3', 'assets/audio/mb_coin.ogg']);
    this.load.audio('jumpAudio', ['assets/audio/smb_jump-small.mp3', 'assets/audio/smb_jump-small.ogg']);
    this.load.audio('doorAudio', ['assets/audio/door.mp3', 'assets/audio/door.ogg']);
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'desertBG');

    this.tomb = this.add.sprite(this.sys.canvas.width * .825, this.sys.canvas.height * -.083, 'tomb');
    this.tomb.setName('tomb');
    this.tomb.setOrigin(0, 0);
    this.tomb.setScale(1.25, 1.25);
    this.tomb.setInteractive(true, function() { });

    this.genie = this.add.sprite(this.sys.canvas.width * .75, this.sys.canvas.height * .25, 'genie');
    this.genie.setName('genie');
    this.genie.setOrigin(0, 0);
    this.genie.setScale(.3, .3);
    this.genie.y = this.genie.y - 800; //hide off screen for now

    this.license = this.add.sprite(this.sys.canvas.width * .20, this.sys.canvas.height * .25, 'license');
    this.license.setName('license');
    this.license.setOrigin(0, 0);
    this.license.setScale(.25, .25);
    this.license.y = this.license.y - 800; //hide off screen for now

    this.blocker = this.physics.add.staticSprite(this.sys.canvas.width * .999, this.sys.canvas.height * .695, 'blocker');
    this.blocker.setScale(1.35).refreshBody();
    this.blocker.setInteractive(true, function() { });

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

    var walkerStyle = { font: '20px Roboto', fill: 'grey' };
    this.walkerSpeak = this.add.text(this.walker.x + 20, this.walker.y - 40, '', walkerStyle);

    this.physics.add.collider(this.walker, this.platforms);
    this.physics.add.collider(this.walker, this.blocker);

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

      //hide the buttons
      this.jumpButton.y = this.jumpButton.y - 800;
      this.leftButton.y = this.leftButton.y - 800;
      this.rightButton.y = this.rightButton.y - 800;
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
      newCoin.y = newCoin.y - 800; //hide off screen for now
      this.coins.push(newCoin);
    }, this);
    this.physics.add.collider(this.walker, this.coins, this.coinCollision, null, this);
    console.log('navigator.userAgent', navigator.userAgent);

    //Scripted dialog
    var timer = 0;
    this.time.delayedCall(timer += 1500, this.jumpRight, null, this);
    this.time.delayedCall(timer += 1000, this.jumpLeft, null, this);
    this.time.delayedCall(timer += 1000, this.jumpRight, null, this);
    this.time.delayedCall(timer += 1000, this.jumpLeft, null, this);
    this.time.delayedCall(timer += 1000, this.jumpRight, null, this);
    this.time.delayedCall(timer += 1000, this.jumpLeft, [true], this);
    this.time.delayedCall(timer += 1000, this.introRight, null, this);
    this.time.delayedCall(timer += 1000, this.introLeft, null, this);
    this.time.delayedCall(timer += 1000, this.introRight, null, this);
    this.time.delayedCall(timer += 1000, this.introLeft, [true], this);
    this.time.delayedCall(timer += 1000, this.introRight, [true], this);
    this.time.delayedCall(timer += 5000, this.showGenie, null, this);
    this.time.delayedCall(timer += 1000, this.whoAreYou, null, this);
    this.time.delayedCall(timer += 2000, this.genieIntro, null, this);
    this.time.delayedCall(timer += 2500, this.whosaWhatsa, null, this);
    this.time.delayedCall(timer += 2000, this.genieIntro2, null, this);
    this.time.delayedCall(timer += 2500, this.genieIntro3, null, this);
    this.time.delayedCall(timer += 3500, this.allTheCandy, null, this);
    this.time.delayedCall(timer += 3000, this.grantedAccess, null, this);
    this.time.delayedCall(timer += 4000, this.howDoWeDoThat, null, this);
    this.time.delayedCall(timer += 3000, this.authorAndAthen, null, this);
    this.time.delayedCall(timer += 5500, this.justCandy, null, this);
    this.time.delayedCall(timer += 3000, this.authenticated, null, this);
    this.time.delayedCall(timer += 3000, this.sureHereYouGo, null, this);
    this.time.delayedCall(timer += 2000, this.showLicense, null, this);
    this.time.delayedCall(timer += 2000, this.youAreAuthenticated, null, this);
    this.time.delayedCall(timer += 3000, this.allEars, null, this);
    this.time.delayedCall(timer += 2500, this.fiveChallenges, null, this);
    this.time.delayedCall(timer += 5500, this.passedChallenges, null, this);
    this.time.delayedCall(timer += 4000, this.aLotOfWork, null, this);
    this.time.delayedCall(timer += 3500, this.importantWork, null, this);
    this.time.delayedCall(timer += 5500, this.doThis, null, this);
    this.time.delayedCall(timer += 3500, this.goodLuck, null, this);
    this.time.delayedCall(timer += 4000, this.hideGenie, null, this);
    this.time.delayedCall(timer += 1500, this.showCoins, null, this);
  }

  update(time: number, delta: number) {

    if(this.walker.x > 618 && this.walker.y > 230) {
        this.scene.start('PyramidScene', {score: this.score});
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

    //open door slowly
    if(this.openDoor && this.door.y > 155) {
        this.door.setY(this.door.y - .5);
    }
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
      this.genieSpeak.text = 'Congrats! You have completed your first challenge.';
      this.genieSpeak2.text = 'Here is your first authorization approval.';
      this.approvalsScore.text = '1/5';
      setTimeout(function() {
          this.approvalsScore.text = '1/5';
      }, 2000, this);
  }

  startDoorOpen() {
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
      this.walkerSpeak.x = this.walker.x + 20;
      this.walkerSpeak.y = this.walker.y - 40;
      this.walkerSpeak.text = 'Candy!'
      this.walker.setVelocityX(150); // move right
      this.sound.play('jumpAudio');
      this.walker.anims.play('walkRight', true); // play walk animation
      this.walkerDirection = 'right';
      this.isPlayerMoving = true;
      this.walker.setVelocityY(-150);
  }

  jumpLeft(final) {
      //var walkerStyle = { font: '20px Roboto', fill: 'red' };
      this.walkerSpeak.x = this.walker.x + 20;
      this.walkerSpeak.y = this.walker.y - 40;
      this.walker.setVelocityX(-150); // move left
      this.sound.play('jumpAudio');
      this.walker.anims.play('walkLeft', true); // play walk animation
      this.walkerDirection = 'left';
      this.isPlayerMoving = true;
      if(final) {
           this.walker.setVelocityY(-100);
            this.walker.setVelocityX(-100); // move left
      } else {
           this.walker.setVelocityY(-150);
            this.walker.setVelocityX(-150); // move left
      }

  }

  introRight(final) {
      console.log('final', final);
      this.walkerSpeak.x = this.walker.x + 20;
      this.walkerSpeak.y = this.walker.y - 60;
      this.walkerSpeak.text = '';
      if(final == true) {
          //this.walkerSpeak.text = 'No candy?!?!'
          this.time.delayedCall(2000, function() {
              this.walkerSpeak.text = 'I was told there would be candy, I see no candy!';
          }, null, this);
      }
      // this.walker.setVelocityX(100); // move right
      // this.walker.anims.play('walkRight', true); // play walk animation
      this.walkerDirection = 'right';
      // this.isPlayerMoving = true;
  }

  introLeft(final) {
      this.walkerSpeak.text = '';
      if(final == true) {
          this.walkerSpeak.text = 'No candy?!?!'
      }
      // this.walker.setVelocityX(-100); // move right
      // this.walker.anims.play('walkLeft', true); // play walk animation
      this.walkerDirection = 'left';
      // this.isPlayerMoving = true;
  }

  showGenie() {
      console.log('in showGenie');
      this.walkerSpeak.text = '';
      this.genie.y = this.genie.y + 800;
      var genieStyle = { font: '40px Roboto', fill: 'grey' };
      this.genieSpeak = this.add.text(this.genie.x - 180, this.genie.y - 40, 'Welcome!', genieStyle);
      this.time.delayedCall(750, function(){
          this.walkerSpeak.text = '';
          this.walker.setVelocityY(-200);
          this.sound.play('jumpAudio');
      }, null, this);

  }

  whoAreYou() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'Whoa, who are you!';
  }

  genieIntro() {
      this.genieSpeak.setFontSize(20);
      this.genieSpeak.x = this.genieSpeak.x - 80;
      this.genieSpeak.text = 'I am the Genie of Secure Access Control';
      this.walkerSpeak.text = '';
  }

  whosaWhatsa() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'The whosa whatsa?';
  }

  genieIntro2() {
      this.genieSpeak.x = this.genieSpeak.x - 100;
      this.genieSpeak.text = 'The Genie of Secure Access Control.';
      this.walkerSpeak.text = '';
  }

  genieIntro3() {
      this.walkerSpeak.text = '';
      this.genieSpeak.text = 'I am here to grant you an access wish.';
  }

  allTheCandy() {
      this.walkerSpeak.x = this.walkerSpeak.x - 75;
      this.genieSpeak.text = '';
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
      this.genieSpeak.text = 'You must be first Authenticated and then Authorized.';
      this.time.delayedCall(3000, function(){
          this.genieSpeak.x = this.genieSpeak.x + 20
          this.genieSpeak.y = this.genieSpeak.y + 10
          this.genieSpeak.text = 'These are the two hallmarks of any good access control system.';
      }, null, this);
  }

  justCandy() {
      this.walkerSpeak.x = this.walkerSpeak.x - 40;
      this.walkerSpeak.text = 'It is just candy but I will be play along, where do we start?';
      this.genieSpeak.text = '';
  }

  authenticated() {
      this.walkerSpeak.text = '';
      this.genieSpeak.text = 'You must first be authenticated, do you have a valid ID?';
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
      this.genieSpeak.text = 'Perfect, you are officially Authenticated, now you need to be authorized.';
  }

  allEars() {
      this.genieSpeak.text = '';
      this.walkerSpeak.text = 'I am all ears, how do we do that?';
  }

  fiveChallenges() {
      this.genieSpeak.x = this.genieSpeak.x - 25;
      this.walkerSpeak.text = '';
      this.genieSpeak.text = 'You must collect five authorization approvals by entering five challenges.';
  }

  passedChallenges() {
      this.genieSpeak.text = 'Once you have passed all five challenges ';
      var genieStyle = { font: '40px Roboto', fill: 'grey' };
      this.genieSpeak2 = this.add.text(this.genieSpeak.x + 40, this.genieSpeak.y + 30, 'you will be granted access to your candy.', this.genieSpeak.style);
  }

  aLotOfWork() {
      this.genieSpeak.text = '';
      this.genieSpeak2.text = '';
      this.walkerSpeak.text = 'Seems like a lot of work just to access some candy.';
  }

  importantWork() {
      this.genieSpeak.text = 'Yes, it is a lot of work, a lot of very important work.';
      this.genieSpeak2.text = 'Secure access control is mission critical!';
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
  }

  showCoins() {
      this.sound.play('newPlayerAudio');
      var style = { font: '20px Roboto', fill: 'grey' };
      this.approvalsLabel = this.add.text(10, 15, 'Approvals granted:', style);
      this.approvalsScore = this.add.text(170, 15, '0/5', style);
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
