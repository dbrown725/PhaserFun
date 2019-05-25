import 'phaser';

//import WelcomeScene from './scenes/WelcomeScene';
import DesertScene from './scenes/DesertScene';
import PyramidScene from './scenes/PyramidScene';

const config:GameConfig = {
    type: Phaser.AUTO,
    scale: {
        parent: 'content',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 320
    },
    resolution: 1,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
      DesertScene, PyramidScene //WelcomeScene,
    ]
};

new Phaser.Game(config);
