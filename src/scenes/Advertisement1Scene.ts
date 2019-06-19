class Advertisement1Scene extends Phaser.Scene {
  meetTheTeam: Phaser.GameObjects.Sprite;
  team: Phaser.GameObjects.Sprite;
  treb: Phaser.GameObjects.Sprite;
  sham: Phaser.GameObjects.Sprite;
  gplSnl: Phaser.GameObjects.Sprite;
  prakTreb: Phaser.GameObjects.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  camera: Phaser.Cameras.Scene2D.Camera;
  countDownText:  Phaser.GameObjects.Text;

  cursors: any;
  isContinue: boolean;
  countDown: integer;
  secondsPassed: integer;
  continueKey: any;
  isMobile: boolean;
  fadeOutStarted: boolean;

  constructor() {
    super({
      key: 'Advertisement1Scene'
    });
  }

  init() {
      this.isContinue = false;
      this.countDown = 31;
      this.secondsPassed = 0;
      this.isMobile = false;
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
    this.prakTreb = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'prakTreb');
    this.gplSnl = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'gplSnl');
    this.sham = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'sham');
    this.treb = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'treb');
    this.team = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'team');
    this.meetTheTeam = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'meetTheTeam');

    this.cursors = this.input.keyboard.createCursorKeys();
    this.continueKey = this.input.keyboard.addKey('C');

    var style = { font: '40px Roboto', fill: 'red' };
    this.countDownText = this.add.text(this.sys.canvas.width * 0.80, this.sys.canvas.height * 0.84, this.countDown.toString(), style);
    if(this.isMobile ) {
      this.rightButton = this.physics.add.staticSprite(this.sys.canvas.width * 0.9, this.sys.canvas.height * 0.88, 'btnRight');
      this.rightButton.setScale(.9).refreshBody();
      this.rightButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event) {
        this.isContinue = true;
      }, this);
      //hide the buttons
      this.rightButton.y = this.rightButton.y - 800;
    }

    this.camera = this.cameras.main;
    this.camera.on('camerafadeoutcomplete', function() {
        this.scene.start('PyramidScene', {});
    }, this);
    this.camera.fadeIn(3000, 1);
    this.fadeOutStarted = false;
  }

  showRightButton(){
    this.rightButton.y = this.rightButton.y + 800;
    this.countDownText.text = '';
  }

  update(time: number, delta: number) {
    var timeInSeconds = Math.floor( time / 1000);
    if(this.countDown > 0  && this.secondsPassed != timeInSeconds) {
      this.secondsPassed = timeInSeconds;
      this.countDown = this.countDown - 1;
      this.countDownText.text = this.countDown.toString();
      if(this.countDown == 25) {
          this.meetTheTeam.y = this.meetTheTeam.y - 800;
      } else if(this.countDown == 20) {
          this.team.y = this.team.y - 800;
      } else if(this.countDown == 15) {
          this.treb.y = this.treb.y - 800;
      } else if(this.countDown == 10) {
          this.sham.y = this.sham.y - 800;
      } else if(this.countDown == 5) {
          this.gplSnl.y = this.gplSnl.y - 800;
      } else if(this.countDown == 0) {
        if(this.isMobile ) {
          this.showRightButton();
        } else {
          this.countDownText.text = ' C key'
        }
      }
    }
    if(!this.fadeOutStarted && (this.isContinue || this.continueKey.isDown)) {
      this.fadeOutStarted = true;
      //fadeout listener will initiate scene change
      this.cameras.main.fade(2000);
    }
  }
}


export default Advertisement1Scene;
