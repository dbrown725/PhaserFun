class CandyHeavenScene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  background2: Phaser.GameObjects.Sprite;
  background3: Phaser.GameObjects.Sprite;
  ground: Phaser.Physics.Arcade.Image;
  walker: Phaser.Physics.Arcade.Sprite;
  platformsContainer: Phaser.GameObjects.Container;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  lollipopBase1: Phaser.Physics.Arcade.Sprite;
  lollipopFruitGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase2: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteGreen: Phaser.Physics.Arcade.Sprite;
  lollipopBase3: Phaser.Physics.Arcade.Sprite;
  lollipopWhiteRed: Phaser.Physics.Arcade.Sprite;
  gummyWormRedEnd: Phaser.Physics.Arcade.Sprite;
  gummyWormRedHead: Phaser.Physics.Arcade.Sprite;
  gummyWormRedMid: Phaser.Physics.Arcade.Sprite;
  candyGreen: Phaser.Physics.Arcade.Sprite;
  wafflePink: Phaser.Physics.Arcade.Sprite;
  cherry: Phaser.Physics.Arcade.Sprite;
  heart: Phaser.Physics.Arcade.Sprite;
  camera: Phaser.Cameras.Scene2D.Camera;

  fadeOutStarted: boolean;
  isMobile: boolean;
  gameOverTitle: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({
      key: 'CandyHeavenScene'
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
    this.load.image('gameOver', 'assets/sprites/gameOver.png');
    this.load.image('wormEnd', 'assets/sprites/gummyWormRedEnd.png');
    this.load.image('wormHead', 'assets/sprites/gummyWormRedHead.png');
    this.load.image('wormMid', 'assets/sprites/gummyWormRedMid.png');
    this.load.image('greenCandy', 'assets/sprites/candyGreen.png');
    this.load.image('pinkWaffle', 'assets/sprites/wafflePink.png');
    this.load.image('cherryImage', 'assets/sprites/cherry.png');
    this.load.image('heartImage', 'assets/sprites/heart.png');
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'backGroundSprites', 'clouds1.png');
    this.background.setScale(.785);
    this.background2 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 70, 'backGroundSprites', 'clouds1.png');
    this.background2.setScale(.785);
    this.background3 = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 90, 'backGroundSprites', 'clouds1.png');
    this.background3.setScale(.785);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.sys.canvas.height - 35, 'ground').setScale(6, 2).refreshBody();

    this.gameOverTitle = this.physics.add.staticSprite(this.cameras.main.centerX, this.cameras.main.centerY - 110, 'gameOver');
    this.gameOverTitle.setScale(.9).refreshBody();

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
    this.gummyWormRedHead = this.physics.add.staticSprite(this.cameras.main.centerX + 140, this.cameras.main.centerY + 124, 'wormHead');
    this.gummyWormRedHead.scaleX = -.6
    this.gummyWormRedHead.scaleY = .6
    this.gummyWormRedHead.refreshBody();
    this.gummyWormRedMid = this.physics.add.staticSprite(this.cameras.main.centerX + 230, this.cameras.main.centerY + 124, 'wormMid');
    this.gummyWormRedMid.setScale(.6).refreshBody();
    this.gummyWormRedEnd = this.physics.add.staticSprite(this.cameras.main.centerX + 280, this.cameras.main.centerY + 124, 'wormEnd');
    this.gummyWormRedEnd.setScale(.6).refreshBody();
    this.candyGreen = this.physics.add.staticSprite(this.cameras.main.centerX + 60, this.cameras.main.centerY  + 124, 'greenCandy');
    this.candyGreen.setScale(.6).refreshBody();
    this.wafflePink = this.physics.add.staticSprite(this.cameras.main.centerX + 280, this.cameras.main.centerY, 'pinkWaffle');
    this.wafflePink.setScale(.6).refreshBody();
    this.heart = this.physics.add.staticSprite(this.cameras.main.centerX + 90, this.cameras.main.centerY + 100, 'heartImage');
    this.heart.setScale(.6).refreshBody();
    this.cherry = this.physics.add.staticSprite(this.cameras.main.centerX + 130, this.cameras.main.centerY + 70, 'cherryImage');
    this.cherry.setScale(.6).refreshBody();



    console.log('navigator.userAgent', navigator.userAgent);

    this.camera = this.cameras.main;
    this.camera.on('camerafadeoutcomplete', function() {
        this.scene.start('DesertScene', {});
    }, this);
    this.camera.fadeIn(3000, 1);
    this.fadeOutStarted = false;
  }

  update(time: number, delta: number) {
  }

}

export default CandyHeavenScene;
