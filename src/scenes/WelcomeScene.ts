class WelcomeScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  background2: Phaser.GameObjects.Sprite;
  ground: Phaser.Physics.Arcade.Image;
  walker: Phaser.Physics.Arcade.Sprite;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  cursors: any;
  enter: any;
  isMobile: boolean;
  smoke: Phaser.GameObjects.Sprite;
  startButton: Phaser.Physics.Arcade.Sprite;
  title: Phaser.Physics.Arcade.Sprite;
  start: boolean;
  lollipopBase1: Phaser.Physics.Arcade.Sprite;
  lollipopFruitGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase2: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase3: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteRed: Phaser.Physics.Arcade.Sprite;

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
    this.background2 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 65, 'backGroundSprites', 'clouds1.png');
    this.background2.setScale(.785);
    this.smoke = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'smoke');
    this.smoke.setScale(2);
    console.log('this.smoke.scale', this.smoke);

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
  }

  update(time: number, delta: number) {
    if(this.start) {
      this.scene.start('DesertScene', {});
    }
    if(this.smoke.scaleX < 5) {
      this.smoke.alpha = this.smoke.alpha - .01;
      this.smoke.scaleX = this.smoke.scaleX * 1.01;
      this.smoke.scaleY = this.smoke.scaleY * 1.01;
    }
    if (this.cursors.space.isDown || this.enter.isDown) {
      this.scene.start('DesertScene', {});
    }
  }

}

export default WelcomeScene;
