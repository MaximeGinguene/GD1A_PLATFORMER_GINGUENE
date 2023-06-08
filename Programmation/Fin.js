export class Fin extends Phaser.Scene{
    constructor(){
        super("Fin");
    }

    preload(){
        this.load.image('histoire', 'Programmation/assets/FondHistoire.png');

        
    }

    create(){
        this.add.image(0, 0, 'histoire').setOrigin(0,0);
        
    }

    update(){
      
    }



};