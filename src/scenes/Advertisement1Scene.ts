class Advertisement1Scene extends Phaser.Scene {
  frog: Phaser.GameObjects.Sprite;
  raccoon: Phaser.GameObjects.Sprite;
  groundHog: Phaser.GameObjects.Sprite;
  meetTheTeam: Phaser.GameObjects.Sprite;
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
      this.countDown = 21;
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
    this.raccoon = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'raccoon');
    this.frog = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'frog');
    this.groundHog = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'groundHog');
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
      if(this.countDown == 15) {
          this.meetTheTeam.y = this.meetTheTeam.y - 800;
      } else if(this.countDown == 10) {
          this.groundHog.y = this.groundHog.y - 800;
      } else if(this.countDown == 5) {
          this.frog.y = this.frog.y - 800;
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
