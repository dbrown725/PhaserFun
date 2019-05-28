class Advertisement1Scene extends Phaser.Scene {
  background: Phaser.GameObjects.Sprite;
  rightButton: Phaser.Physics.Arcade.Sprite;
  cursors: any;
  isContinue: boolean;
  countDown: integer;
  countDownText:  Phaser.GameObjects.Text;
  secondsPassed: integer;
  continueKey: any;
  isMobile: boolean;

  constructor() {
    super({
      key: 'Advertisement1Scene'
    });
  }

  init() {
      this.isContinue = false;
      this.countDown = 16;
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
    //visuals
    this.load.image('ad1BG', '/assets/sprites/colored_desert_Ad_1.png');
    this.load.image('btnRight', '/assets/sprites/rightButton.png');
  }

  create() {
    this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'ad1BG');

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
      if(this.countDown == 0) {
        if(this.isMobile ) {
          this.showRightButton();
        } else {
          this.countDownText.text = ' C key'
        }
      }
    }
    if(this.isContinue || this.continueKey.isDown) {
        this.scene.start('PyramidScene', {});
    }
  }
}


export default Advertisement1Scene;
