export class tuto extends Phaser.Scene {
    constructor() {
        super("tuto");
    }


    preload() {
        this.load.image('Tuto', 'Programmation/assets/Tuto.png');
        this.load.image('BoutonReturn', 'Programmation/assets/boutonreturnMenu.png');

    }

    create() {
       


        this.add.image(0, 0, 'Tuto').setOrigin(0, 0);

        var boutonback = this.add.image(1650, 100, 'BoutonReturn').setInteractive().setOrigin(0,0);

        boutonback.on('pointerup', this.sceneMenu, this);






    }

    sceneMenu() {


        this.scene.start('Menu');
    }

}
