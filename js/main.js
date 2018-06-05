//this game will have only 1 state
var newPlayerAudioPlayed = false;
var outside = true;
var walker;
var GameState = {
  //load the game assets before the game starts
  init: function() {
    console.log('in init');
  },
  preload: function() {
    //  This sets a limit on the up-scale
    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.setMinMax(400, 300, 800, 600);

    //scaling options
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally

    game.scale.pageAlignHorizontally = true;

    game.scale.pageAlignVertically = true;

    //screen size will be set automatically

    //game.scale.setScreenSize(true);

    this.load.image('background', 'assets/images/colored_desert_640_341.png');
    this.load.image('background_tomb', 'assets/images/darkTomb.png');
    this.load.image('ground', 'assets/images/platformTransparent.png')
    this.load.image('button_left', 'assets/images/button_left_grey.png');
    this.load.image('button_right', 'assets/images/button_right_grey.png');
    this.load.image('button_jump', 'assets/images/button_jump.png');
    this.load.image('tomb', 'assets/images/tomb.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.atlasJSONHash('leftRightWalk', 'assets/images/leftRightWalk.png', 'assets/images/leftRightWalk.json');
    //  Firefox doesn't support mp3 files, so use ogg
    this.load.audio('new_player_audio', ['assets/audio/mb_new.mp3', 'assets/audio/mb_new.ogg']);
    this.load.audio('coin_audio', ['assets/audio/mb_coin.mp3', 'assets/audio/mb_coin.ogg']);
    this.load.audio('jump_audio', ['assets/audio/smb_jump-small.mp3', 'assets/audio/smb_jump-small.ogg']);
    game.sound.boot();
  },
  //executed after everything is loaded
  create: function() {
  this.newPlayerAudio = game.add.audio('new_player_audio');
  this.coinAudio = game.add.audio('coin_audio');
  this.jumpAudio = game.add.audio('jump_audio');

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.backgroundTomb = this.game.add.sprite(0, 0, 'background_tomb');
    this.backgroundOriginal = this.game.add.sprite(0, 0, 'background');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

      //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

      // Here we create the ground.
    let ground = platforms.create(0, game.world.height - 65, 'ground');

      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

      //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    this.coin = this.game.add.sprite(this.game.width * .125, this.game.world.height * .5, 'coin');
    this.coin.name = 'coin';
    this.coin.anchor.setTo(0, 0);
    this.coin.scale.setTo(.06, .06);
    this.coin.inputEnabled = true;
    game.physics.arcade.enable(this.coin);
    this.coin.body.immovable = true;
    //this.coin.body.collideWorldBounds = true;

    this.tomb = this.game.add.sprite(this.game.width * .825, this.game.world.height * -.083, 'tomb');
    this.tomb.name = 'tomb';
    this.tomb.anchor.setTo(0, 0);
    this.tomb.scale.setTo(1.25, 1.25);
    this.tomb.inputEnabled = true;

    this.walker = game.add.sprite(this.game.width * .5, this.game.world.height * 0.1, 'leftRightWalk', 'player_09.png');
    this.walker.scale.setTo(0.40, 0.40);

    //  We need to enable physics on the player
     game.physics.arcade.enable(this.walker);

     this.walker.body.bounce.y = 0.2
     this.walker.body.gravity.y = 800
     this.walker.body.collideWorldBounds = true

    this.buttonJump = this.game.add.sprite(this.game.width * .05, this.game.world.height * .860, 'button_jump');
    this.buttonJump.name = 'jump';
    this.buttonJump.anchor.setTo(0, 0);
    this.buttonJump.scale.setTo(1, 1);
    this.buttonJump.inputEnabled = true;
    this.buttonJump.events.onInputDown.add(this.jumpClicked, this);


    // animation
    var frameNamesRight = Phaser.Animation.generateFrameNames('player_', 9, 11, '.png', 2);
    var frameNamesLeft = Phaser.Animation.generateFrameNames('player_', 12, 14, '.png', 2);
    this.walker.animations.add('walkLeft', frameNamesLeft, 10, false, false);
    this.walker.animations.play('walkLeft');
    this.walker.animations.add('walkRight', frameNamesRight, 10, false, false);
    this.walker.animations.play('walkRight');
    this.buttonLeft = this.game.add.sprite(this.game.width * .60, this.game.world.height * .85, 'button_left');
    this.buttonLeft.name = 'left';
    this.buttonLeft.anchor.setTo(0, 0);
    this.buttonLeft.scale.setTo(1, 1);
    this.buttonLeft.inputEnabled = true;
    this.buttonRight = this.game.add.sprite(this.game.width * .80, this.game.world.height * .85, 'button_right');
    this.buttonRight.name = 'right';
    this.buttonRight.anchor.setTo(0, 0);
    this.buttonRight.scale.setTo(1,1);
    this.buttonRight.inputEnabled = true;
  },
  //this is executed multiple times per second
  update: function() {

    //  Setup collisions for the player, diamonds, and our platforms
    game.physics.arcade.collide(this.walker, platforms);

    if(!newPlayerAudioPlayed) {
      this.newPlayerAudio.play();
      newPlayerAudioPlayed = true;
    }

    if (game.physics.arcade.overlap(this.walker, this.coin))
    {
      console.log("collision");
      this.coin.visible = false;
      this.coin.kill();
      this.coinAudio.play();
    }


     if (game.input.activePointer.isDown) {
       if( Phaser.Rectangle.contains( this.buttonLeft, game.input.x, game.input.y) ){
            this.walker.animations.play('walkLeft');

            if(this.walker.x < 0) {
              if(outside == false) {
                this.walker.x = game.width - 50;
                outside = true;
              }

              this.tomb.visible = true;
              this.backgroundOriginal.visible = true;
            } else {
              this.walker.x -= 3;
            }
       }
       if( Phaser.Rectangle.contains( this.buttonRight, game.input.x, game.input.y) ){
            this.walker.animations.play('walkRight');
            if(this.walker.x > (game.width -50)) {
                 if(outside == true) {
                   this.walker.x = 50;
                   outside = false;
                 }
                 this.tomb.visible = false;
                 this.backgroundOriginal.visible = false;
            } else {
              this.walker.x += 3;
            }
       }
       // if( Phaser.Rectangle.contains( this.buttonJump, game.input.x, game.input.y) ) {
       //      //  This allows the player to jump!
       //      if (this.walker.body.touching.down) {
       //        this.walker.body.velocity.y = -400;
       //        this.jumpAudio.play();
       //
       //      }
       // }
     }
  }
  ,
  jumpClicked: function(pointer, doubleTap) {
    console.log('jumpClicked');
     if (this.walker.body.touching.down) {
       this.walker.body.velocity.y = -400;
       this.jumpAudio.play();
     }
  }
  // doSomething: function(pointer, doubleTap) {
  //   console.log('tapped pointer.clientX, pointer.clientY', pointer.clientX, pointer.clientY);
  //   if(doubleTap) {
  //     console.log('doubleTap');
  //   } else {
  //     console.log('single tap');
  //   }
  //   if(this.currentPlayer.customProperties.name == 'Player09') {
  //     console.log('Player09');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player10;
  //     this.currentPlayer.x = tempX;
  //   } else if(this.currentPlayer.customProperties.name == 'Player10') {
  //     console.log('Player10');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player11;
  //     this.currentPlayer.x = tempX;
  //   } else if(this.currentPlayer.customProperties.name == 'Player11') {
  //     console.log('Player11');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player09;
  //     this.currentPlayer.x = tempX;
  //   }
  //   if(pointer.clientX < this.game.width * .5) {
  //     console.log('left hand side');
  //     this.currentPlayer.scale.setTo(-0.4, 0.4);
  //     this.currentPlayer.x -= 8;
  //   } else {
  //     console.log('right hand side');
  //     this.currentPlayer.scale.setTo(0.4, 0.4);
  //     this.currentPlayer.x += 8;
  //   }
  // },
  // playerClicked: function(pointer, doubleTap) {
  //   console.log('player clicked', this.playerBig);
  //   if(this.playerBig == true) {
  //     console.log('in true');
  //     this.player09.scale.setTo(0.4, 0.4);
  //     this.playerBig = false;
  //   } else {
  //     console.log('in false');
  //     this.player09.scale.setTo(1, 1);
  //     this.playerBig = true;
  //   }
  //   //this.player09.scale.setTo(2, 2);
  // },
  // buttonClicked: function(button, pointer) {
  //   console.log('button.name', button.name);
  //   console.log('pointer', pointer);
  //   if(this.currentPlayer.customProperties.name == 'Player09') {
  //     console.log('Player09');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player10;
  //     this.currentPlayer.x = tempX;
  //   } else if(this.currentPlayer.customProperties.name == 'Player10') {
  //     console.log('Player10');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player11;
  //     this.currentPlayer.x = tempX;
  //   } else if(this.currentPlayer.customProperties.name == 'Player11') {
  //     console.log('Player11');
  //     var tempX = this.currentPlayer.x;
  //     this.currentPlayer.x = this.game.width * 1.5;
  //     this.currentPlayer = this.player09;
  //     this.currentPlayer.x = tempX;
  //   }
  //   if(button.name == 'left' ) {
  //     console.log('left hand side');
  //     this.currentPlayer.scale.setTo(-0.4, 0.4);
  //     this.currentPlayer.x -= 8;
  //   } else {
  //     console.log('right hand side');
  //     this.currentPlayer.scale.setTo(0.4, 0.4);
  //     this.currentPlayer.x += 8;
  //   }
  // }

};

//initiate the Phaser framework
var game = new Phaser.Game(640, 320, Phaser.AUTO);
//var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS);

game.state.add('GameState', GameState);
game.state.start('GameState');
