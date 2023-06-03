export class Menu extends Phaser.Scene{
    constructor(){
        super("Menu");
    }

    preload(){
        this.load.image('menu', 'assets/fondmenu.png');
        this.load.spritesheet('play', 'assets/SpriteSheetBoutonPlay.png', { frameWidth: 512, frameHeight: 172});
        this.load.image('option', 'assets/option.png'); 
        this.load.image('quit', 'assets/quitter.png'); 
    }

    create(){
        this.add.image(0, 0, 'menu');
        var boutonPlay = this.add.sprite(960, 400, 'play').setInteractive();
        this.add.image(960, 500, 'option');
        this.add.image(960, 600, 'quit');

        boutonPlay.on('pointerup', this.sceneScene01, this);

        // Ajoute l'animation au bouton play
        this.anims.create({
            key: 'play_animation',
            frames: this.anims.generateFrameNumbers('play', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        // Joue l'animation du bouton play
        boutonPlay.anims.play('play_animation');
    }

    update(){
      
    }

    sceneScene01(){
        this.scene.start("Scene01")
    }
};
