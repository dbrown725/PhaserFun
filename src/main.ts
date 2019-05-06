import 'phaser';

import DesertScene from './scenes/DesertScene';

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
      DesertScene
    ]
};

new Phaser.Game(config);
