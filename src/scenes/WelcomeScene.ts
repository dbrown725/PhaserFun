class WelcomeScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  background2: Phaser.GameObjects.Sprite;
  background3: Phaser.GameObjects.Sprite;
  ground: Phaser.Physics.Arcade.Image;
  walker: Phaser.Physics.Arcade.Sprite;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  startButton: Phaser.Physics.Arcade.Sprite;
  lollipopBase1: Phaser.Physics.Arcade.Sprite;
  lollipopFruitGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase2: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase3: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteRed: Phaser.Physics.Arcade.Sprite;
  camera: Phaser.Cameras.Scene2D.Camera;
  billowingClouds: Phaser.GameObjects.Sprite[];

  fadeOutStarted: boolean;
  cursors: any;
  enter: any;
  isMobile: boolean;
  title: Phaser.Physics.Arcade.Sprite;
  start: boolean;

  constructor() {
    super({
      key: 'WelcomeScene'
    });
  }

  init() {
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
    this.load.image('ground', 'assets/sprites/platformTransparent.png');
    this.load.atlasXML('backGroundSprites', 'assets/sprites/bgElements_spritesheet.png', 'assets/sprites/bgElements_spritesheet.xml');
    this.load.image('smoke', '/assets/sprites/smoke.png');
    this.load.image('btnStart', 'assets/sprites/startButton.png');
    this.load.image('candyHeavenTitle', 'assets/sprites/candyHeavenKenney.png');
    this.load.image('lolliBase', 'assets/sprites/lollipopBaseBeige.png');
    this.load.image('lolliFruitGreen', 'assets/sprites/lollipopFruitGreen.png');
    this.load.image('lolliWhiteGreen', 'assets/sprites/lollipopWhiteGreen.png');
    this.load.image('lolliWhiteRed', 'assets/sprites/lollipopWhiteRed.png');
    this.load.atlas('walker', 'assets/sprites/leftRightWalk.png', 'assets/sprites/leftRightWalk.json');
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'backGroundSprites', 'clouds1.png');
    this.background.setScale(.785);
    this.background2 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'backGroundSprites', 'clouds1.png');
    this.background2.setScale(.785);
    this.background3 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 90, 'backGroundSprites', 'clouds1.png');
    this.background3.setScale(.785);

    var cloudLocation = [[-350, 85], [-300, 65], [-250, 55], [-200, 55], [-150, 85], [-85, 85], [0, 85], [85, 85], [150, 85], [200, 85], [250, 85], [300, 85], [350, 85]];
    this.billowingClouds = [];
    var min=2;
    var max=8;
    cloudLocation.forEach(function(value) {
      var newCloud = this.physics.add.staticSprite(this.cameras.main.centerX + value[0], this.cameras.main.centerY + value[1], 'smoke');
      //newCloud.scaleX = (Math.random() * (+max - +min) + +min);
      //newCloud.scaleY = (Math.random() * (+max - +min) + +min);
      newCloud.setScale(Math.random() * (+max - +min) + +min);
      newCloud.alpha = .3;
      this.billowingClouds.push(newCloud);
    }, this);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 35, 'ground').setScale(6, 2).refreshBody();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.enter = this.input.keyboard.addKey('ENTER');


    this.title = this.physics.add.staticSprite(this.cameras.main.centerX, this.cameras.main.centerY - 110, 'candyHeavenTitle');
    this.title.setScale(.9).refreshBody();

    this.startButton = this.physics.add.staticSprite(this.cameras.main.centerX, this.cameras.main.centerY + 60, 'btnStart');
    this.startButton.setScale(.9).refreshBody();
    this.startButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
      this.start = true;
    }, this);

    this.walker = this.physics.add.staticSprite(100, this.sys.canvas.height * 0.8, 'walker', 'player_11.png');
    this.walker.setScale(0.50, 0.50);

    this.lollipopBase1 = this.physics.add.staticSprite(this.cameras.main.centerX + 180, this.cameras.main.centerY + 100, 'lolliBase');
    this.lollipopBase1.setScale(.6).refreshBody();
    this.lollipopFruitGreen = this.physics.add.staticSprite(this.cameras.main.centerX + 180, this.cameras.main.centerY + 60, 'lolliFruitGreen');
    this.lollipopFruitGreen.setScale(.6).refreshBody();
    this.lollipopBase2 = this.physics.add.staticSprite(this.cameras.main.centerX + 280, this.cameras.main.centerY + 100, 'lolliBase');
    this.lollipopBase2.setScale(.6).refreshBody();
    this.lollipopWhiteGreen = this.physics.add.staticSprite(this.cameras.main.centerX + 280, this.cameras.main.centerY + 60, 'lolliWhiteGreen');
    this.lollipopWhiteGreen.setScale(.6).refreshBody();
    this.lollipopBase3 = this.physics.add.staticSprite(this.cameras.main.centerX + 230, this.cameras.main.centerY + 70, 'lolliBase');
    this.lollipopBase3.setScale(.6).refreshBody();
    this.lollipopWhiteRed = this.physics.add.staticSprite(this.cameras.main.centerX + 230, this.cameras.main.centerY + 30, 'lolliWhiteRed');
    this.lollipopWhiteRed.setScale(.6).refreshBody();

    console.log('navigator.userAgent', navigator.userAgent);

    this.camera = this.cameras.main;
    this.camera.on('camerafadeoutcomplete', function() {
        this.scene.start('DesertScene', {});
    }, this);
    this.camera.fadeIn(1000, 1);
    this.fadeOutStarted = false;

  }

  update(time: number, delta: number) {
    if(!this.fadeOutStarted  && (this.start || this.cursors.space.isDown || this.enter.isDown)) {
      this.fadeOutStarted = true;
      this.cameras.main.fade(2000);
    }
    this.billowingClouds.forEach(function(value) {
      if(value.scaleX < 17) {
        value.alpha = value.alpha - .0003;
        value.scaleX = value.scaleX * 1.0015;
        value.scaleY = value.scaleY * 1.0015;
        if(value.y < this.cameras.main.centerY + 85) {
            value.y = value.y + .004;
        } else {
            value.y = value.y + .084;
        }
      } else {
        var min=1;
        var max=8;
        value.alpha = .3;
        value.setScale(Math.random() * (+max - +min) + +min);
        if(value.x < this.cameras.main.centerX - 175) {
          value.y = this.cameras.main.centerY + 90;
        } else {
          value.y = this.cameras.main.centerY + 140;
        }
      }
    }, this);
  }

}

export default WelcomeScene;
