export class Menu extends Phaser.Scene{
    constructor(){
        super("Menu");
    }

    preload(){
        this.load.image('menu', 'Programmation/assets/fondmenu.png');
        this.load.spritesheet('play', 'Programmation/assets/BoutonPlay.png', { frameWidth: 300, frameHeight: 100});
        this.load.image('option', 'Programmation/assets/option.png'); 
        this.load.image('quit', 'Programmation/assets/quitter.png'); 
        this.load.image('Logo', 'Programmation/assets/LogoJeu.png'); 
    }

    create(){
        this.add.image(0, 0, 'menu');
        var boutonPlay = this.add.sprite(960, 550, 'play').setInteractive();
        this.add.image(960, 700, 'option');
        this.add.image(960, 850, 'quit');
        this.add.image(960, 250, 'Logo');

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
