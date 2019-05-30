import 'phaser';

import WelcomeScene from './scenes/WelcomeScene';
import DesertScene from './scenes/DesertScene';
import PyramidScene from './scenes/PyramidScene';
import Advertisement1Scene from './scenes/Advertisement1Scene';
import Advertisement2Scene from './scenes/Advertisement2Scene';
import GiantScene from './scenes/GiantScene';
import CandyHeavenScene from './scenes/CandyHeavenScene';

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
      WelcomeScene, DesertScene, Advertisement1Scene, PyramidScene, Advertisement2Scene, GiantScene, CandyHeavenScene
    ]
};

new Phaser.Game(config);
