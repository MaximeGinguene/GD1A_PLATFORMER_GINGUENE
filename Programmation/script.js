import { Scene01 as Scene01 } from "./Scene01.js";
import { Scene02 as Scene02 } from "./Scene02.js";
import { Menu as Menu } from "./menu.js";
import {tuto as tuto} from "./tuto.js";
import {Fin as Fin} from "./Fin.js";

var config = {
    type: Phaser.WEBGL,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600},
            debug: false
        },
        tileBias: 32
    },
    scene: [ Menu,tuto,Scene01,Fin, Scene02,], 
    scale: {
        parent: 'game_viewport',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, 
    },
    pixelArt: true
    
}

var game = new Phaser.Game(config);